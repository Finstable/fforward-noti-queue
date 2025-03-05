import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import BullBoardUI from './bull-board/bull.ui';
import { ConfigService } from '@nestjs/config';
import { ErrorLoggingMiddleware } from "./middleware/logger.middleware";
import { GlobalExceptionFilter } from "./sheard/exceptions/global-exception.filter";
import * as express from "express";
import { CloudWatchLoggerService } from "./module/cloudwatch-logger/cloudwatch-logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  BullBoardUI(app as NestApplication);

  app.use(express.json());
  app.use(new ErrorLoggingMiddleware(app.get(CloudWatchLoggerService)).use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
