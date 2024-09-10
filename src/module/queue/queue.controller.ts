import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueueServices } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueServices) {}

  @Get()
  async getNotiStatusByNotiId(
    @Query('type') type: string,
    @Query('jobId') jobId: string,
  ) {
    try {
      if (!type || !jobId) {
        throw new Error('Type and jobId are required');
      }
      return await this.queueService.getNotiStatusByNotiId(type, jobId);
    } catch (error) {
      return JSON.stringify({ status: 'error', message: error.message });
    }
  }

  @Post('noti/:type')
  async addNotiJob(@Param('type') type: string, @Body() body: any) {
    try {
      if (!body) {
        throw new Error('Body is required');
      }
      if (type === 'mail') {
        return await this.queueService.addNotiMailJob({ data: body });
      } else if (type === 'otp') {
        return await this.queueService.addNotiOtpJob({ data: body });
      }
    } catch (error) {
      return JSON.stringify({ status: 'error', message: error.message });
    }
  }
}
