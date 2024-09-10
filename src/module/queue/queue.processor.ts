import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { EmailService } from 'src/sheard/service/mail.service';

@Processor('noti-mail')
export class NotiMaillProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  private readonly logger = new Logger(NotiMaillProcessor.name);

  async process(job: Job) {
    this.logger.debug(`Start Job : ${job.id}`);
    await this.emailService.sendEmailWithTemplate(
      job.data.email,
      job.data.value,
    );
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}

@Processor('noti-otp')
export class NotiOtpProcessor extends WorkerHost {
  private readonly logger = new Logger(NotiOtpProcessor.name);

  async process(job: Job) {
    this.logger.debug(`Start Job : ${job.id}`);
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}
