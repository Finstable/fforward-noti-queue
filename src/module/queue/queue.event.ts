import {
  QueueEventsListener,
  QueueEventsHost,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Queue as QueueEntity } from './entities/queue.entities';
import { InjectRepository } from '@nestjs/typeorm';

@QueueEventsListener('noti-mail')
export class MaillQueueEvents extends QueueEventsHost {
  private readonly logger = new Logger(MaillQueueEvents.name);
  private readonly queueType: string = 'noti-mail';
  constructor(
    @InjectRepository(QueueEntity)
    private readonly queueRepository: Repository<QueueEntity>,
  ) {
    super();
  }

  @OnQueueEvent('active')
  async onActive(job: { jobId: number; prev?: string }) {
    this.logger.debug(
      `noti-mail-${job.jobId} Start active event... | Prev ${job.prev}`,
    );
    const queue = await this.queueRepository.update(
      {
        queueID: job.jobId,
        queueType: this.queueType,
      },
      { status: 'processing' },
    );
    this.logger.debug(queue);
  }

  @OnQueueEvent('completed')
  async onCompleted(job: { jobId: number; returnvalue: string }) {
    this.logger.debug(`noti-mail-${job.jobId} Start complete event...`);
    const queue = await this.queueRepository.update(
      {
        queueID: job.jobId,
        queueType: this.queueType,
      },
      { status: 'completed' },
    );
    this.logger.debug(queue);
  }

  @OnQueueEvent('failed')
  async onFailed(job: { jobId: number; failedReason: string }) {
    this.logger.debug(`noti-mail-${job.jobId} Start failed event...`);
    const queue = await this.queueRepository.update(
      {
        queueID: job.jobId,
        queueType: this.queueType,
      },
      { status: 'failed' },
    );
    this.logger.debug(queue);
  }
}

@QueueEventsListener('noti-otp')
export class OtpQueueEvents extends QueueEventsHost {
  private readonly logger = new Logger(OtpQueueEvents.name);

  @OnQueueEvent('completed')
  onCompleted({
    jobId,
  }: {
    jobId: string;
    returnvalue: string;
    prev?: string;
  }) {
    this.logger.debug('Start completed event...');
    this.logger.debug(jobId);
    this.logger.debug('Finishing completed event');
  }
}
