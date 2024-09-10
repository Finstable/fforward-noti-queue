import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';

export interface IMailContentData {
  to: string;
  from: string;
  content: any;
  sendgridTemplateId: string;
}

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  notification_type: string;

  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  @IsString()
  provider: string;

  @IsNotEmpty()
  data: IMailContentData;
}
