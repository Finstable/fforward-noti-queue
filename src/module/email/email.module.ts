import { Module } from '@nestjs/common';
import { EmailService } from 'src/sheard/service/mail.service';

@Module({
  imports: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
