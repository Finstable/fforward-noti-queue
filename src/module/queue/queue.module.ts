import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { NotiMaillProcessor, NotiOtpProcessor } from './queue.processor';
import { MaillQueueEvents, OtpQueueEvents } from './queue.event';
import { QueueServices } from './queue.service';
import { EmailService } from 'src/sheard/service/mail.service';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue as QueueEntity } from './entities/queue.entities';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'noti-mail',
    }),
    BullModule.registerQueueAsync({
      name: 'noti-otp',
    }),
    TypeOrmModule.forFeature([QueueEntity]),
    EmailModule,
  ],
  controllers: [QueueController],
  providers: [
    NotiMaillProcessor,
    NotiOtpProcessor,
    OtpQueueEvents,
    MaillQueueEvents,
    QueueServices,
    EmailService,
  ],
})
export class QueueModule {}
