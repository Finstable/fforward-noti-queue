export interface IAppConfig {
  port: number;
  sendgrid: ISendgridConfig;
}

export interface IJwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
  tokenExpiresIn: string;
  resetPasswordExpiresIn: string;
  resetPasswordActiveUserExpiresIn: string;
}

export interface IJwtAdminConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
  tokenExpiresIn: string;
}

export interface IDatabaseConfig {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  entities: string[];
  migrations: string[];
  autoLoadEntities: boolean;
}

export interface IAwsConfig {
  region: string;
  logGroupName: string;
  logStreamName: string;
}

export interface KeyCloakConfig {
  realm: string;
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  clientConnectId: string;
  clientConnectSecret: string;
}

export interface ISendgridConfig {
  apiKey: string;
}

export default (): IAppConfig => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
});
