import { Injectable } from '@nestjs/common';
import { NodeEventEnum } from '../enums/node-event.enum';
import { getBack } from '../functions/back-button.function';
import { MessageControls } from '../interfaces/message-controls.interface';
import { MachineState } from '../type/machine-state.type';
import { NodeService } from './node.service';


@Injectable()
export class ExecuteService {

    constructor(private readonly nodeService: NodeService) {}

    exec(state: MachineState, text: string): void {
       const node = this.nodeService.searchNodeById(Number(state.context.nodeId));
       node.addContent(text);
    }

}
