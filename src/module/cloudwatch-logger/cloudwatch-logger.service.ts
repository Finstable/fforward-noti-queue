import { Injectable, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { RequestContextService } from "src/middleware/request-context.service";

@Injectable()
export class CloudWatchLoggerService implements LoggerService {
  private readonly cloudWatchLogs: AWS.CloudWatchLogs;
  private readonly logGroupName: string;
  private readonly logStreamName: string;

  constructor(
    private readonly requestContextService: RequestContextService,

    private configService: ConfigService
  ) {
    // Initialize AWS CloudWatch Logs
    AWS.config.update({ region: this.configService.get<string>("aws.region") }); // Set your AWS region

    this.cloudWatchLogs = new AWS.CloudWatchLogs();

    // Define your log group and log stream names
    this.logGroupName =
      this.configService.get<string>("aws.logGroupName") || "default-log-group";
    this.logStreamName =
      this.configService.get<string>("aws.logStreamName") ||
      "default-log-stream";

    // Ensure the log group and stream exist
    this.ensureLogGroupAndStream();
  }

  private async ensureLogGroupAndStream() {
    try {
      // Check if the log group exists
      const logGroups = await this.cloudWatchLogs
        .describeLogGroups({ logGroupNamePrefix: this.logGroupName })
        .promise();
      if (
        !(
          logGroups.logGroups &&
          logGroups.logGroups.find(
            (group) => group.logGroupName === this.logGroupName
          )
        )
      ) {
        await this.cloudWatchLogs
          .createLogGroup({ logGroupName: this.logGroupName })
          .promise();
      }

      // Check if the log stream exists
      const logStreams = await this.cloudWatchLogs
        .describeLogStreams({
          logGroupName: this.logGroupName,
          logStreamNamePrefix: this.logStreamName,
        })
        .promise();
      if (
        !(
          logStreams.logStreams &&
          logStreams.logStreams.find(
            (stream) => stream.logStreamName === this.logStreamName
          )
        )
      ) {
        await this.cloudWatchLogs
          .createLogStream({
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName,
          })
          .promise();
      }
    } catch (error) {
      console.error("Error creating log group or stream:", error);
    }
  }

  private async putLogEvents(message: string) {
    try {
      const sequenceToken = await this.getSequenceToken();
      await this.cloudWatchLogs
        .putLogEvents({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          logEvents: [
            {
              message,
              timestamp: Date.now(),
            },
          ],
          sequenceToken,
        })
        .promise();
    } catch (error) {
      console.error("Error sending log event to CloudWatch:", error);
    }
  }

  private async getSequenceToken(): Promise<string | undefined> {
    const logStreams = await this.cloudWatchLogs
      .describeLogStreams({
        logGroupName: this.logGroupName,
        logStreamNamePrefix: this.logStreamName,
      })
      .promise();
    const logStream = logStreams.logStreams?.find(
      (stream) => stream.logStreamName === this.logStreamName
    );
    return logStream?.uploadSequenceToken;
  }

  log(message: string, context: any) {
    const contxtConvert = JSON.stringify(context);
    const timestamp = new Date().toISOString();
    try {
      const requestId = this.requestContextService.getRequestId();
      this.putLogEvents(
        `${timestamp} [Log]: ${message}\nrequestId: ${requestId}\ncontext: ${contxtConvert}`
      );
    } catch (e) {
      console.log(e);
    }
  }

  error(message: string, context: any, trace: string) {
    const contxtConvert = JSON.stringify(context);
    const timestamp = new Date().toISOString();
    this.putLogEvents(
      `[ERROR]: ${message}\ncontext: ${contxtConvert}\nTrace: ${trace}`
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
