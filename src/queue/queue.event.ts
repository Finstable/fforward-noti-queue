import { QueueEventsListener ,QueueEventsHost ,OnQueueEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@QueueEventsListener('noti-mail')
export class MaillQueueEvents extends QueueEventsHost {
  private readonly logger = new Logger(MaillQueueEvents.name);

  @OnQueueEvent('completed')
  onCompleted({ jobId }: { jobId: string; returnvalue: string; prev?: string }) {
    this.logger.debug('Start completed event...');
    this.logger.debug(jobId);
    this.logger.debug('Finishing completed event');
  }
}

@QueueEventsListener('noti-otp')
export class OtpQueueEvents extends QueueEventsHost {
  private readonly logger = new Logger(OtpQueueEvents.name);

  @OnQueueEvent('completed')
  onCompleted({ jobId }: { jobId: string; returnvalue: string; prev?: string }) {
    this.logger.debug('Start completed event...');
    this.logger.debug(jobId);
    this.logger.debug('Finishing completed event');
  }
}