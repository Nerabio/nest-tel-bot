import { Injectable } from '@nestjs/common';
import { NodeModel } from '../../models/node.model';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NodeEventEnum } from '../enums/node-event.enum';

@Injectable()
export class NodeService {
  activeNode: NodeModel | null;
  activeEvent: NodeEventEnum;
  root: NodeModel = new NodeModel('Главная', 1);
  constructor(private eventEmitter: EventEmitter2) {
    const n = new NodeModel('Новая');
    n.addContent('dirdrdkr drlfdr');
    n.add(new NodeModel('Под Новая'));
    n.add(new NodeModel('Под Новая 2'));
    n.add(new NodeModel('Под erg'));
    n.add(new NodeModel('Под Ноfthfthвая 2'));
    this.root.addRange([n, new NodeModel('Slot')]);
  }

  setEvent(event: NodeEventEnum): void {
    this.activeEvent = event;
  }

  getRoot(): NodeModel {
    this.activeNode = this.root;
    return this.root;
  }

  selectNodeById(id: number): NodeModel | null {
    const node = this.searchNodeById(id, this.root.nodes);
    this.activeNode = node;
    return node;
  }

  searchNodeById(
    id = 12,
    nodes: NodeModel[] = this.root.nodes,
  ): NodeModel | null {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        return nodes[i];
      } else {
        if (nodes[i].nodes.length > 0) {
          this.searchNodeById(id, nodes[i].nodes);
        }
      }
    }
    return null;
  }

}
