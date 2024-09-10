import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { queueConfig } from './config/queue.config';
import { QueueModule } from './module/queue/queue.module';
import { EmailModule } from './module/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, typeorm],
      isGlobal: true,
      cache: true,
    }),
    queueConfig,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    QueueModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
