import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired } from '@sendgrid/mail';
import * as SendGrid from '@sendgrid/mail';
import { CreateJobDto, IMailContentData } from 'src/module/queue/dto/queue.dot';

@Injectable()
export class EmailService {
  private logger: Logger;
  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(EmailService.name);
    SendGrid.setApiKey(this.configService.get('sendgrid.apiKey'));
    //Initialize the logger. This is done for simplicity. You can use a logger service instead
    // this.logger = new Logger(SendGridClient.name);
    //Get the API key from config service or environment variable
    // SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmailWithTemplate(data: IMailContentData): Promise<void> {
    //The data to be used in the template
    const payload = {
      to: data.to,
      from: data.from,
      dynamicTemplateData: data.content,
      templateId: data.sendgridTemplateId, //se
    };

    const mail: MailDataRequired = payload;

    await this.send(mail);
  }

  async send(mail: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(mail);
      // this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
    } catch (error) {
      //You can do more with the error
      // this.logger.error('Error while sending email', error);
      throw error;
    }
  }
}
