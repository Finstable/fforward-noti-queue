import { BullModule } from '@nestjs/bullmq';

export const queueConfig = BullModule.forRoot({
  connection: {
    host: '172.20.0.2',
    port: 6379,
  },
  defaultJobOptions: {
    removeOnComplete: 1000,
    removeOnFail: 5000,
    attempts: 3,
  },
});