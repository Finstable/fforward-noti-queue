import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { CloudWatchLoggerService } from "src/module/cloudwatch-logger/cloudwatch-logger.service";
import * as jwt from "jsonwebtoken";

@Injectable()
export class ErrorLoggingMiddleware implements NestMiddleware {
  constructor(private cloudService: CloudWatchLoggerService) {
    this.use = this.use.bind(this);
  }
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const authHeader = req.headers["authorization"];
    interface DecodedToken {
      exp?: number;
      iat?: number;
      sub?: string;
      userId?: string;
    }
    let decodedToken: DecodedToken | null = null;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        decodedToken = jwt.decode(token); // Decode without verifying signature
        req["user"] = {
          exp: decodedToken?.exp,
          iat: decodedToken?.iat,
          sub: decodedToken?.sub,
          userId: decodedToken?.userId,
        };
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    res.on("finish", () => {
      const responseTime = Date.now() - startTime;
      const userAgent = req.headers["user-agent"];
      const clientIp = req.headers["x-forwarded-for"] || req.ip;

      const logData = {
        timestamp: new Date(),
        level: res.statusCode >= 400 ? "ERROR" : "INFO ",
        application: "fforward-noti-queue",
        environment: process.env.MODE,
        component: "api",
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query,
        params: req.params,
        statusCode: res.statusCode,
        message: res.locals.errorMessage || res.statusMessage,
        userAgent,
        clientIp,
        responseTime: `${responseTime}ms`,
        user: req["user"],
      };

      if (res.statusCode >= 400) {
        this.cloudService.error(
          "",
          logData,
          res.locals.errorMessage || res.statusMessage
        );
      } else if (
        res.statusCode === 200 ||
        res.statusCode === 201 ||
        res.statusCode === 304
      ) {
        this.cloudService.debug(JSON.stringify(logData));
      }
    });

    next();
  }
}
