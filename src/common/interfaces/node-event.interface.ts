export type NodeEvents = [AddContentEvent, GetContentEvent, AddNodeEvent];

export type NodeEvent = NodeEvents extends readonly (infer ElementType)[]? ElementType : never;

export interface AddContentEvent {
  type: 'add-content';
}

export interface GetContentEvent {
  type: 'get-content';
}

export interface AddNodeEvent {
  type: 'add-node';
}
