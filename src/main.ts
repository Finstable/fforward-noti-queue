import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import BullBoardUI from './bull-board/bull.ui';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  BullBoardUI(app as NestApplication);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
