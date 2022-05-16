import { Injectable } from '@nestjs/common';
import { EventObject, StateMachine } from '@xstate/fsm';
import { Context } from '../../models/fsm.model';
import { NodeEventEnum } from '../enums/node-event.enum';
import { NodeService } from './node.service';

export type MachineState = StateMachine.State<
  Context,
  EventObject,
  { value: any; context: Context }
>;

export type InlineKeyboardButton = { text: string; callback_data: string }[];

@Injectable()
export class RenderService {
  constructor(private readonly nodeService: NodeService) {}
  public render(state: MachineState): InlineKeyboardButton | null {
    console.log('this state');
    console.log(state.matches(NodeEventEnum.SELECT_NODE));
    if (state.matches(NodeEventEnum.SELECT_NODE)) {
      return this.getAllNodes(state);
    }
    if (state.matches(NodeEventEnum.SELECT_OPERATION)) {
      return this.getOperations(state);
    }
    return null;
  }

  private getAllNodes(state: MachineState): InlineKeyboardButton | null {
    const rootMap = this.nodeService.getRoot();
    const buttons = rootMap?.nodes.map((node) => {
      return { text: node.name, callback_data: node.id.toString() };
    });
    return buttons;
  }

  private getOperations(state: MachineState): InlineKeyboardButton | null {
    return [
      {
        text: 'Добавить контент',
        callback_data: 'event/' + NodeEventEnum.ADD,
      },
      {
        text: 'SET_NODE_ID',
        callback_data: 'event/' + NodeEventEnum.SET_NODE_ID,
      },
      {
        text: 'Добавить узел',
        callback_data: 'event/' + NodeEventEnum.ADD,
      },
      {
        text: 'Просмотр содермимого',
        callback_data: 'event/' + NodeEventEnum.OPEN,
      },
      {
        text: '< BACK',
        callback_data: 'event/' + NodeEventEnum.BACK,
      },
    ];
  }
}
