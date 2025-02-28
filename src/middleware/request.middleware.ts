import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { v4 as uuidv4 } from 'uuid';
import { RequestContextService } from './request-context.service';


@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(
    private readonly requestContextService: RequestContextService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Generate and set a unique request ID
    const requestId = uuidv4();
    this.requestContextService.setRequestId(requestId);
    next();
  }
}
