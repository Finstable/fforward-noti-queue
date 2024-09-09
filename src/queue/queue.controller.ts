import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QueueServices } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueServices) {}

  @Get('')
  async getNotiStatusByNotiId() {
    // this.queueService.getNotiStatusByNotiId();
  }

  @Post('noti/:type')
  async addNotiJob(@Param('type') type: string, @Body() body: any) {
    if (type === 'mail') {
      this.queueService.addNotiMailJob({ data: body });
    } else if (type === 'otp') {
      this.queueService.addNotiOtpJob({ data: body });
    }
  }
}
