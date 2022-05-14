import { Injectable } from '@nestjs/common';
import { EventObject, StateMachine } from '@xstate/fsm';
import { Context } from '../../models/fsm.model';
import { NodeEventEnum } from '../enums/node-event.enum';

@Injectable()
export class RenderService {
  public render(
    state: StateMachine.State<
      Context,
      EventObject,
      { value: any; context: Context }
    >,
  ): null {
    console.log('this state');
    console.log(state.matches(NodeEventEnum.SELECT_NODE));
    return null;
  }
}
