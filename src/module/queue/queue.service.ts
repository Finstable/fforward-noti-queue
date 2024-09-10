import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
export class QueueServices {
  constructor(
    @InjectQueue('noti-mail') private readonly notiMailQueue: Queue,
    @InjectQueue('noti-otp') private readonly notiOtpQueue: Queue,
  ) {}

  async addNotiMailJob(data: any) {
    try {
      const res = await this.notiMailQueue.add('noti-mail', data,
        {
            attempts: 10,
        }
      );
      return JSON.stringify({
        status: 'success',
        data: res,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addNotiOtpJob(data: any) {
    try {
      const res = await this.notiOtpQueue.add('noti-otp', data);
      return JSON.stringify({
        status: 'success',
        data: res,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getNotiStatusByNotiId(type: string, jobId: string) {
    try {
      if (!type || !jobId) {
        throw new Error('Type and jobId are required');
      }

      if (type === 'mail') {
        const res = await this.notiMailQueue.getJob(jobId);
        return JSON.stringify({
          status: 'success',
          data: {
            id: res.id,
            name: res.name,
            data: res.data.data,
          },
        });
      } else if (type === 'otp') {
        const res = await this.notiOtpQueue.getJob(jobId);
        return JSON.stringify({
          status: 'success',
          data: {
            id: res.id,
            name: res.name,
            data: res.data.data,
          },
        });
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
