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
  ) {
    this.nService.subscribe((state) => {
      console.log(state);
      this.stateHandler(state);
    });
  }
  @SceneEnter()
  onSceneEnter() {
    this.nService.start();
    return 'hello';
  }

  private stateHandler(state: MachineState): void {
    const control = this.renderService.render(state);
    if (state.changed && control) {
      this.ctx.reply(control.title, {
        reply_markup: {
          inline_keyboard: control.inlineButtons,
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

    // this.nService.send({
    //   type: 'SELECT_OPERATION_ID',
    //   operationId: event,
    // } as SetOperationIdEventInterface);

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
