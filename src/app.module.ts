import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { queueConfig } from './module/queue/queue.config';
import { QueueModule } from './module/queue/queue.module';
import { EmailModule } from './module/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    queueConfig,
    QueueModule,
    EmailModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
