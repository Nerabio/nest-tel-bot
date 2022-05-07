import { assign, createMachine } from '@xstate/fsm';

export const nodeMachine = createMachine({
  id: 'node',
  context: {
    nodeId: null,
    operation: null,
  },
  initial: 'enter',
  states: {
    enter: {
      on: {
        SELECT_NODE: { target: 'selectNode' },
      },
    },
    selectNode: {
      on: {
        SET_NODE_ID: {
          actions: assign({ nodeId: 'isSetNodeId' }),
        },
        SELECT_OPERATION: { target: 'selectOperation' },
        BACK: { target: 'enter' },
      },
    },
    back: {
      on: {
        SELECT_NODE: { target: 'selectNode' },
      },
    },
    selectOperation: {
      on: {
        EDIT: { target: 'edit' },
        ADD: { target: 'add' },
        OPEN: { target: 'open' },
        DEL: { target: 'del' },
      },
    },
    add: {
      on: {
        ADD_NODE: {},
        ADD_CONTENT: {},
        BACK: { target: 'selectOperation' },
      },
    },
    edit: { on: { BACK: { target: 'selectOperation' } } },
    open: { on: { BACK: { target: 'selectOperation' } } },
    del: { on: { BACK: { target: 'selectOperation' } } },
  },
});
