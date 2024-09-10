import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Queue as QueueEntity } from './entities/queue.entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJobDto } from './dto/queue.dot';

@Injectable()
export class QueueServices {
  constructor(
    @InjectQueue('noti-mail') private readonly notiMailQueue: Queue,
    @InjectQueue('noti-otp') private readonly notiOtpQueue: Queue,
    @InjectRepository(QueueEntity)
    private readonly queueRepository: Repository<QueueEntity>,
  ) {}

  async addNotiMailJob(data: CreateJobDto) {
    try {
      const res = await this.notiMailQueue.add('noti-mail', data, {
        attempts: 5,
        backoff: {
          type: 'fixed',
          delay: 3000,
        },
      });

      const queue = await this.queueRepository.create({
        queueType: 'noti-mail',
        queueID: Number(res.id),
        status: 'pending',
        content: res.data,
      });

      await this.queueRepository.save(queue);

      return {
        status: 'success',
        data: {
          queueId: queue.id,
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addNotiOtpJob(data: CreateJobDto) {
    try {
      const res = await this.notiOtpQueue.add('noti-otp', data);

      const queue = await this.queueRepository.create({
        queueType: 'noti-otp',
        queueID: Number(res.id),
        status: 'pending',
        content: res.data,
      });

      await this.queueRepository.save(queue);

      return {
        status: 'success',
        data: {
          queueId: queue.id,
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getNotiStatusByNotiId(jobId: string) {
    try {
      if (!jobId) {
        throw new Error('Type and jobId are required');
      }
      const queue = await this.queueRepository.findOne({
        where: { id: jobId },
      });
      return {
        status: 'success',
        data: {
          queueId: queue.id,
          status: queue.status,
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
