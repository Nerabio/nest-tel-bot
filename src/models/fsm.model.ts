import { assign, createMachine } from '@xstate/fsm';

export interface Context {
  nodeId?: string;
  operationId?: string;
}

// const assignId = assign({
//   nodeId: (context, event) => event['nodeId'],
// });

const setNodeId = assign({
  nodeId: (context: Context, event) => {
    return (context.nodeId = event['nodeId']);
  },
});

// const selectOperationId = assign({
//   operationId: (context, event) => event['operationId'],
// });

const selectOperationId = assign({
  operationId: (context: Context, event) => {
    return (context.operationId = event['operationId']);
  },
});

const clearOperationId = assign({
  operationId: (context: Context) => {
    return (context.operationId = null);
  },
});

const clearNodeId = assign({
  operationId: (context: Context) => {
    return (context.nodeId = null);
  },
});

function glassIsFull(context, event) {
  return context.nodeId >= 10;
}

export const nodeMachine = createMachine<Context>(
  {
    id: 'node',
    context: {
      nodeId: null,
      operationId: null,
    },
    initial: 'enter',
    states: {
      enter: {
        on: {
          GET_NODE_LIST: { target: 'getNodeList' },
        },
      },
      getNodeList: {
        on: {
          SELECT_NODE_ID: {
            target: 'selectOperation',
            actions: [setNodeId],
          },
        },
      },
      selectNode: {
        on: {
          SELECT_NODE_ID: {
            target: 'selectOperation',
            actions: [setNodeId],
          },
          // SELECT_OPERATION: {
          //   target: 'selectOperation',
          //   actions: [selectOperationId],
          // },
          BACK: { target: 'getNodeList' },
        },
      },
      back: {
        on: {
          SELECT_NODE: { target: 'selectNode' },
        },
      },
      selectOperation: {
        on: {
          // SELECT_OPERATION_ID: {
          //   target: 'selectOperation',
          //   actions: [selectOperationId],
          // },
          EDIT: { target: 'edit', cond: glassIsFull },
          ADD: { target: 'add' },
          OPEN: { target: 'open' },
          DEL: { target: 'del' },
          BACK: { target: 'selectNode', actions: [clearNodeId] },
        },
      },
      operationDone:{
        on:{
          BACK: { target: 'selectOperation', actions: [clearOperationId] },
        }
      },
      add: {
        on: {
          ADD_NODE: {},
          ADD_CONTENT: {},
          OPERATION_DONE: {
            target: 'operationDone'
          },
          BACK: { target: 'selectOperation', actions: [clearOperationId] },
        },
      },
      edit: {
        on: {
          BACK: {
            target: 'selectOperation',
            actions: [clearOperationId],
          },
        },
      },
      open: {
        on: {
          BACK: { target: 'selectOperation', actions: [clearOperationId] },
        },
      },
      del: {
        on: {
          BACK: { target: 'selectOperation', actions: [clearOperationId] },
        },
      },
    },
  },
  {
    actions: {
      // реализация действия
      // setNodeId: (context, event) => {
      //   console.log('Green!');
      // },
      setNodeId,
      selectOperationId,
      clearOperationId,
      clearNodeId,
    },
  },
);
//  {
//     actions: {
//       // реализация действия
//       alertGreen: (context, event) => {
//         alert('Green!');
//       },
//     },
//     activities: {
//       /* ... */
//     },
//     delays: {
//       /* ... */
//     },
//     guards: {
//       /* ... */
//     },
//     services: {
//       /* ... */
//     },
//   }
