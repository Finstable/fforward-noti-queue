import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CloudWatchLoggerService } from "./cloudwatch-logger.service";
import { RequestContextService } from "src/middleware/request-context.service";
import { RequestIdMiddleware } from "src/middleware/request.middleware";

@Module({
  providers: [CloudWatchLoggerService, RequestContextService],
  exports: [CloudWatchLoggerService],
})
export class CloudWatchLoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
