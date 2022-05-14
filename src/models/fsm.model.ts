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
    initial: 'getNodeList',
    states: {
      enter: {
        on: {
          SELECT_NODE: { target: 'selectNode' },
        },
      },
      getNodeList: {
        on: {
          SELECT_NODE: {
            target: 'selectNode',
            actions: [setNodeId],
          },
        },
      },
      selectNode: {
        on: {
          SELECT_NODE_ID: {
            target: 'selectNode',
            actions: [setNodeId],
          },
          SELECT_OPERATION: {
            target: 'selectOperation',
            actions: [selectOperationId],
          },
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
          SELECT_OPERATION_ID: {
            target: 'selectOperation',
            actions: [selectOperationId],
          },
          EDIT: { target: 'edit', cond: glassIsFull },
          ADD: { target: 'add' },
          OPEN: { target: 'open' },
          DEL: { target: 'del' },
          BACK: { target: 'selectNode' },
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
  },
  {
    actions: {
      // реализация действия
      // setNodeId: (context, event) => {
      //   console.log('Green!');
      // },
      setNodeId,
      selectOperationId,
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
