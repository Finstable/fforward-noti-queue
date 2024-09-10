import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { EmailService } from 'src/sheard/service/mail.service';
import { CreateJobDto } from './dto/queue.dot';

@Processor('noti-mail')
export class NotiMaillProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  private readonly logger = new Logger(NotiMaillProcessor.name);

  async process(job: Job) {
    this.logger.debug(`Start Job : ${job.id}`);
    const body: CreateJobDto = job.data;
    try {
      if (body.provider === 'sendgrid') {
        await this.emailService.sendEmailWithTemplate(body.data);
      }
    } catch (error) {
      this.logger.error('Error while sending email', error);
      throw error;
    }
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
