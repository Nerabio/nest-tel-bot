import { Injectable } from '@nestjs/common';
import { ContentModel } from 'src/models/node.model';
import { button } from 'telegraf/typings/markup';
import { NodeEventEnum } from '../enums/node-event.enum';
import { getBack } from '../functions/back-button.function';
import { MessageControls } from '../interfaces/message-controls.interface';
import { InlineKeyboardButton } from '../type/Inline-keyboard-button.type';
import { MachineState } from '../type/machine-state.type';
import { NodeService } from './node.service';


@Injectable()
export class RenderService {
  constructor(private readonly nodeService: NodeService) {}
  public render(state: MachineState): MessageControls | null {
    console.log('this state');
    console.log(state.matches(NodeEventEnum.SELECT_NODE));
    if (state.matches(NodeEventEnum.SELECT_NODE)) {
      return this.getAllNodes(state);
    }
    if (state.matches(NodeEventEnum.GET_NODE_LIST)) {
      return this.getAllNodes(state);
    }
    if (state.matches(NodeEventEnum.SELECT_OPERATION)) {
      return this.getOperations(state);
    }
    if (state.matches(NodeEventEnum.OPERATION_DONE)) {
      return this.getCallBackMessage('DONE');
    }
    if (state.matches('open')) {
      return this.getContentNode(state);
    }
    return null;
  }

  private getContentNode(state: MachineState): MessageControls | null {
    const node = this.nodeService.searchNodeById(Number(state.context.nodeId));
    const buttons = node?.getContent().map((model: ContentModel) => {
      return [{ text: model.content, callback_data: '1' }];
    });

    buttons.push(getBack());
    return {
      title: node.name,
      inlineButtons: buttons,
    };
  }

  private getAllNodes(state: MachineState): MessageControls | null {
    const rootMap = this.nodeService.getRoot();
    const buttons = rootMap?.nodes.map((node) => {
      return [{ text: node.name, callback_data: node.id.toString() }];
    });
    return {
      title: rootMap.name,
      inlineButtons: buttons,
    };
  }

  private getOperations(state: MachineState): MessageControls {
    const selectNode = this.nodeService.selectNodeById(
      Number(state.context.nodeId),
    );
    return {
      title: `Выбран ${selectNode.name}`,
      inlineButtons: [
        [
          {
            text: 'Добавить контент',
            callback_data: 'event/' + NodeEventEnum.ADD,
          },
          {
            text: 'SET_NODE_ID',
            callback_data: 'event/' + NodeEventEnum.SET_NODE_ID,
          },
        ],
        [
          {
            text: 'Добавить узел',
            callback_data: 'event/' + NodeEventEnum.ADD,
          },
          {
            text: 'Просмотр содермимого',
            callback_data: 'event/' + NodeEventEnum.OPEN,
          },
        ],
        getBack(),
      ],
    } as MessageControls;
  }

  private getCallBackMessage(message: string): MessageControls {
    return {
      title: `${message}`,
      inlineButtons: [
        getBack(),
      ],
    } as MessageControls;
  }
}
