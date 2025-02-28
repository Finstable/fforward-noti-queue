import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private requestId: string;
  constructor() {
    console.log("RequestContextService")
  }

  // Set the request ID
  setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  // Get the request ID
  getRequestId(): string {
    return this.requestId;
  }
}
