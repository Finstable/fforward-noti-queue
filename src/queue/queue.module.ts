import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { NotiMaillProcessor, NotiOtpProcessor } from './queue.processor';
import { MaillQueueEvents, OtpQueueEvents } from './queue.event';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'noti-mail',
    }),
    BullModule.registerQueueAsync({
      name: 'noti-otp',
    }),
  ],
  controllers: [QueueController],
  providers: [
    NotiMaillProcessor,
    NotiOtpProcessor,
    OtpQueueEvents,
    MaillQueueEvents,
  ],
})
export class QueueModule {}
