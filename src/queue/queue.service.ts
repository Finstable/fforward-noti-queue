import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueServices {
  constructor(
    @InjectQueue('noti-mail') private readonly notiMailQueue: Queue,
    @InjectQueue('noti-otp') private readonly notiOtpQueue: Queue,
  ) {}

  async addNotiMailJob(data: any) {
    try {
      await this.notiMailQueue.add('noti-mail', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addNotiOtpJob(data: any) {
    try {
      await this.notiMailQueue.add('noti-otp', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
