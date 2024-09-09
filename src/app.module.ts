import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { queueConfig } from './queue/queue.config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    queueConfig,
    BullModule.registerQueueAsync({
      name: 'noti-maill',
    }),
    BullModule.registerQueueAsync({
      name: 'noti-otp',
    }),
    BullModule.registerFlowProducer({
      name: 'noti-flow',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
