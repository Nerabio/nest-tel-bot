import { Module } from '@nestjs/common';
import { EchoUpdate } from './echo.update';
import { EchoService } from './echo.service';
import { RandomNumberScene } from '../greeter/scenes/random-number.scene';
import { NodeService } from '../common/services/node.service';
import { ExecuteService } from 'src/common/services/execute.service';

@Module({
  providers: [EchoUpdate, EchoService, RandomNumberScene, NodeService, ExecuteService],
})
export class EchoModule {}
