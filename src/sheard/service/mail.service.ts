import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired } from '@sendgrid/mail';
import * as SendGrid from '@sendgrid/mail';

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

  async sendEmailWithTemplate(recipient: string, value: any): Promise<void> {
    const data = {
      to: 'krittamet.dev@gmail.com',
      from: 'noreply@fforward.finance',
      content: {
        expire: '1',
        otp1: '1',
        otp2: '2',
        otp3: '3',
        otp4: '4',
        otp5: '5',
        otp6: '6',
        name: 'Krittamet',  
        refCode: 'ASDFG',
        senderEmail: 'email@example.com',
      },
      sendgridTemplateId: 'd-2e43b79c0b504d4a938d329daf5ca5cc', //se
    };

    const mail: MailDataRequired = {
      to: data.to,
      from: data.from, //Approved sender ID in Sendgrid
      templateId: data.sendgridTemplateId, //Retrieve from config service or environment variable
      dynamicTemplateData: data.content, //The data to be used in the template
    };

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
