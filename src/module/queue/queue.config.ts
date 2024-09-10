import { BullModule } from '@nestjs/bullmq';

export const queueConfig = BullModule.forRoot({
  connection: {
    host: 'localhost',
    port: 6379,
  },
  defaultJobOptions: {
    delay: 3000, // delay in 3 seconds before processing the job
    removeOnComplete: 1000, // collect last completed 1000 jobs
    removeOnFail: 1000, // collect last failed 1000 jobs
    attempts: 3, // retry 3 times before fail
  },
});
