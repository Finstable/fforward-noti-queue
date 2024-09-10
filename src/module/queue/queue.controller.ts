import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { QueueServices } from './queue.service';
import { CreateJobDto } from './dto/queue.dot';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueServices) {}

  @Get('/:id')
  async getNotiStatusByNotiId(@Param('id') jobId: string) {
    try {
      if (!jobId) {
        throw new Error('Type and jobId are required');
      }
      return await this.queueService.getNotiStatusByNotiId(jobId);
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  @Post('noti')
  async addNotiJob(@Body() body: CreateJobDto) {
    try {
      if (!body) {
        throw new Error('Body is required');
      }
      if (body.notification_type === 'mail') {
        return await this.queueService.addNotiMailJob(body);
      } else if (body.notification_type === 'otp') {
        return await this.queueService.addNotiOtpJob(body);
      }
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
