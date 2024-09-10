import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { NestApplication } from '@nestjs/core';

const BullBoardUI = (app: NestApplication): void => {
  const redisOptions = {
    port: 6379,
    host: 'localhost',
  };
  const notiMailManager = new Queue('noti-mail', { connection: redisOptions });
  const notiOtpManager = new Queue('noti-otp', { connection: redisOptions });

  const serverAdapter = new ExpressAdapter();
  createBullBoard({
    queues: [
      new BullAdapter(notiMailManager, { readOnlyMode: false }),
      new BullAdapter(notiOtpManager, { readOnlyMode: false }),
    ],
    serverAdapter: serverAdapter,
  });

  serverAdapter.setBasePath('/queues/ui');
  app.use('/queues/ui', serverAdapter.getRouter());
};

export default BullBoardUI;
