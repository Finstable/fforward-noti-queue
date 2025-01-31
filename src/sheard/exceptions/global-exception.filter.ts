import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from "@nestjs/common";
  import { Response } from "express";
  
  @Catch(HttpException)
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
  
      response.locals.errorMessage =
        (errorResponse as any).message || "An error occurred";
  
      response.status(status).json({
        statusCode: status,
        message: response.locals.errorMessage,
      });
    }
  }