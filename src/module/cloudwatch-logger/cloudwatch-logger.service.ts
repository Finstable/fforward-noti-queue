import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { RequestContextService } from 'src/middleware/request-context.service';

@Injectable()
export class CloudWatchLoggerService implements LoggerService {
  private readonly cloudWatchLogs: AWS.CloudWatchLogs;
  private readonly logGroupName: string;
  private readonly logStreamName: string;

  constructor(
    private readonly requestContextService: RequestContextService,

    private configService: ConfigService,
  ) {
    // Initialize AWS CloudWatch Logs
    AWS.config.update({ region: this.configService.get<string>('aws.region') }); // Set your AWS region

    this.cloudWatchLogs = new AWS.CloudWatchLogs();

    // Define your log group and log stream names
    this.logGroupName = this.configService.get<string>('aws.logGroupName');
    this.logStreamName = this.configService.get<string>('aws.logStreamName');

    // Ensure the log group and stream exist
  }

  private async putLogEvents(message: string) {
    const params = {
      logEvents: [
        {
          message,
          timestamp: Date.now(),
        },
      ],
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
    };

    try {
      await this.cloudWatchLogs?.putLogEvents(params).promise();
    } catch (error) {
      console.error('Error putting log events to CloudWatch:', error);
    }
  }

  log(message: string, context: any) {
    const contxtConvert = JSON.stringify(context);
    const timestamp = new Date().toISOString();
    try {
      const requestId = this.requestContextService.getRequestId();
      this.putLogEvents(
        `${timestamp} [Log]: ${message}\nrequestId: ${requestId}\ncontext: ${contxtConvert}`,
      );
    } catch (e) {
      console.log(e);
    }
  }

  error(message: string, context: any, trace: string) {
    const contxtConvert = JSON.stringify(context);
    const timestamp = new Date().toISOString();
    this.putLogEvents(
      `[ERROR]: ${message}\ncontext: ${contxtConvert}\nTrace: ${trace}`,
    );
  }

  warn(message: string, context: any) {
    this.putLogEvents(`WARN: ${message}`);
  }

  debug(message: string) {
    this.putLogEvents(`DEBUG: ${message}`);
  }

  verbose(message: string) {
    this.putLogEvents(`VERBOSE: ${message}`);
  }
}
