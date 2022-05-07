import { Module } from '@nestjs/common';
import { GreeterUpdate } from './greeter.update';
import { RandomNumberScene } from './scenes/random-number.scene';
import { NodeScene } from './scenes/node.scene';
import { NodeService } from '../common/services/node.service';

@Module({
  providers: [GreeterUpdate, RandomNumberScene, NodeScene, NodeService],
})
export class GreeterModule {}
