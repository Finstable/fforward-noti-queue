import { Job } from "bullmq";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from '@nestjs/common';

@Processor('noti-mail')
export class NotiMaillProcessor extends WorkerHost {
  private readonly logger = new Logger(NotiMaillProcessor.name);

  async process(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}

@Processor('noti-otp')
export class NotiOtpProcessor extends WorkerHost {
  private readonly logger = new Logger(NotiOtpProcessor.name);

  async process(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}