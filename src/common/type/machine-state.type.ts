import { EventObject, StateMachine } from "@xstate/fsm";
import { Context } from "src/models/fsm.model";


export type MachineState = StateMachine.State<
  Context,
  EventObject,
  { value: any; context: Context }
>;