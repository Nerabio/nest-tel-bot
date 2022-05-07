export class NodeModel {
  private static idCounter = 2;
  id: number | null;
  parentId: number | null;
  name: string;
  nodes: NodeModel[] = [];
  content: ContentModel[] = [];
  constructor(name: string, id: number = null) {
    this.id = id;
    this.name = name;
  }
  add(node: NodeModel): void {
    if (!node?.id) {
      node.id = NodeModel.generationId();
    }
    node.parentId = this.id;
    this.nodes.push(node);
  }
  addRange(nodes: NodeModel[]): void {
    nodes.forEach((node) => {
      this.add(node);
    });
  }
  getById(id: number): NodeModel | null {
    const node = this.nodes.find((item) => item.id === id);
    return node ? node : null;
  }
  getByName(name: string): NodeModel | null {
    const node = this.nodes.find((item) => item.name === name);
    return node ? node : null;
  }
  getContent(): ContentModel[] {
    return this.content.filter((c) => c.nodeId === this.id);
  }
  addContent(text: string): void {
    this.content.push(new ContentModel(text, this.id));
  }
  protected static generationId(): number {
    return this.idCounter++;
  }
}


export class ContentModel {
  id: number;
  nodeId: number;
  content: string;
  constructor(content: string, nodeId: number) {
    this.nodeId = nodeId;
    this.content = content;
  }
}
