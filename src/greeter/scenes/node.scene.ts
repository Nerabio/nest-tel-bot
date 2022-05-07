import {
  Scene,
  SceneEnter,
  SceneLeave,
  Command,
  Ctx,
  Action,
  On,
  Message,
} from 'nestjs-telegraf';
import { NODE_SCENE_ID } from '../../app.constants';
import { Context } from '../../interfaces/context.interface';
import { NodeService } from '../../common/services/node.service';
import { Update as UT } from 'telegraf/typings/core/types/typegram';
import { NodeEventEnum } from '../../common/enums/node-event.enum';
import { nodeMachine } from '../../models/fsm.model';
import { interpret } from '@xstate/fsm';

@Scene(NODE_SCENE_ID)
export class NodeScene {
  nService = interpret(nodeMachine);
  constructor(private readonly nodeService: NodeService) {}
  @SceneEnter()
  onSceneEnter() {
    this.nService.start();
    return 'hello';
  }

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Bye Bye 👋';
  }

  @Command(['root', 'node'])
  onGetRoot(@Ctx() ctx: Context) {
    const rootMap = this.nodeService.getRoot();
    const buttons = rootMap?.nodes.map((node) => {
      return { text: node.name, callback_data: node.id.toString() };
    });

    this.nService.send({ type: 'SELECT_NODE' });
    console.log(this.nService.state.value);

    ctx.reply(rootMap.name, {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  }

  // @Command(['get', 'node'])
  // onNodeCommand(@Ctx() ctx: Context, @Message('text') text: string) {
  //   console.log(Number(text)); ///Nan
  //   const selectNode = this.nodeService.searchNodeById();
  //   console.log(this.nodeService.root);
  //   const buttons = selectNode?.nodes.map((node) => {
  //     return { text: node.name, callback_data: node.id.toString() };
  //   });
  //   console.log(buttons);
  //    ctx.reply(selectNode?.name, {
  //     reply_markup: {
  //       inline_keyboard: [buttons],
  //     },
  //   });
  //   //return `[${selectNode?.id}: ${selectNode?.name}] => (${children})`;
  // }

  @Action(/\d+/)
  async onSelectNode(@Ctx() ctx: Context & { update: UT.CallbackQueryUpdate }) {
    const cbQuery = ctx.update.callback_query;
    const nodeId = 'data' in cbQuery ? cbQuery.data : null;
    ctx.answerCbQuery();

    const buttons = [
      [
        {
          text: 'Добавить контент',
          callback_data: 'event/' + NodeEventEnum.ADD,
        },
      ],
      [
        {
          text: 'Добавить узел',
          callback_data: 'event/' + NodeEventEnum.ADD,
        },
      ],
      [
        {
          text: 'Просмотр содермимого',
          callback_data: 'event/' + NodeEventEnum.OPEN,
        },
      ],
      [
        {
          text: '< BACK',
          callback_data: 'event/' + NodeEventEnum.BACK,
        },
      ],
    ];

    const node = this.nodeService.selectNodeById(+nodeId);

    this.nService.send({ type: 'SELECT_OPERATION' });
    console.log(this.nService.state.value);

    ctx.reply('Выбран пункт -> ' + node?.name, {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }

  @Action(/event\/\w+/)
  async onEventNode(@Ctx() ctx: Context & { update: UT.CallbackQueryUpdate }) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    const event = userAnswer.replace('event/', '') as NodeEventEnum;
    this.nodeService.setEvent(event);
    // switch (event) {
    //   case NodeEventEnum.ADD_NODE:
    //     this.nodeService.addNodeToCurrent();
    //     break;
    // }

    this.nService.send({ type: event });
    console.log(this.nService.state.value);

    return (
      'событие установлено ' + this.nodeService.activeNode.name + ' ' + event
    );
  }

  @On('text')
  onMessage(@Message('text') text: string): string {
    //this.nodeService.addContent(text);
    return 'save ';
  }

  @Command('leave')
  async onLeaveCommand(ctx: Context): Promise<void> {
    await ctx.scene.leave();
  }
}
