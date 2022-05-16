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
import {
  MachineState,
  RenderService,
} from '../../common/services/render.service';

@Scene(NODE_SCENE_ID)
export class NodeScene {
  ctx: Context;
  nService = interpret(nodeMachine);
  constructor(
    private readonly nodeService: NodeService,
    private readonly renderService: RenderService,
  ) {}
  @SceneEnter()
  onSceneEnter() {
    this.nService.start();
    this.nService.subscribe((state) => {
      console.log(state);
      this.stateHandler(state);
    });
    return 'hello';
  }

  private stateHandler(state: MachineState): void {
    // const chatId = this.ctx.callbackQuery.getMessage().getMessageId();
    // this.ctx.deleteMessage(this.ctx.);
    // if (!this.ctx) {
    //   return;
    // }
    // if (!this.ctx?.callbackQuery) {
    //   return;
    // }
    //
    // const cbQuery = this.ctx.callbackQuery;
    // console.log(cbQuery.message);
    // this.ctx.deleteMessage(cbQuery.message.message_id);
    const buttons = this.renderService.render(state);
    if (buttons) {
      this.ctx.reply('root', {
        reply_markup: {
          inline_keyboard: [buttons],
        },
      });
    }
  }

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Bye Bye 👋';
  }

  @Command(['root', 'node'])
  onGetRoot(@Ctx() ctx: Context & { update: UT.CallbackQueryUpdate }) {
    this.ctx = ctx;

    this.nService.send({ type: 'SELECT_NODE' });
    // const buttons = this.renderService.render(this.nService.state);
    // ctx.reply('root', {
    //   reply_markup: {
    //     inline_keyboard: [buttons],
    //   },
    // });
  }

  @Action(/\d+/)
  async onSelectNode(@Ctx() ctx: Context & { update: UT.CallbackQueryUpdate }) {
    this.ctx = ctx;
    const cbQuery = ctx.update.callback_query;
    const nodeId = 'data' in cbQuery ? cbQuery.data : null;
    ctx.answerCbQuery();

    this.nService.send({
      type: 'SELECT_NODE_ID',
      nodeId: nodeId,
    } as SetNodeIdEventInterface);

    //const buttons = this.renderService.render(this.nService.state);

    //const node = this.nodeService.selectNodeById(+nodeId);

    this.nService.send({
      type: 'SELECT_OPERATION',
    });
    // ctx.reply('Выбран пункт -> ' + node?.name, {
    //   reply_markup: {
    //     inline_keyboard: [buttons],
    //   },
    // });
  }

  @Action(/event\/\w+/)
  async onEventNode(@Ctx() ctx: Context & { update: UT.CallbackQueryUpdate }) {
    this.ctx = ctx;
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    const event = userAnswer.replace('event/', '') as NodeEventEnum;
    this.nodeService.setEvent(event);

    this.nService.send({
      type: 'SELECT_OPERATION_ID',
      operationId: event,
    } as SetOperationIdEventInterface);

    this.nService.send({ type: event });

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
