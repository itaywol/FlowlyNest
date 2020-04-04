import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { isProduction } from '../main';

export function formatIp(req: Request) {
  return req.ip !== undefined ? req.ip.replace(/^.*:/, '') : 'NO.IP';
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('winston') private readonly logger: Logger) {
    console.debug = function(...args: any) {
      return this.logger.debug.apply(logger, args);
    };
    console.log = function(...args: any) {
      return this.logger.info.apply(logger, args);
    };
    console.info = function(...args: any) {
      return this.logger.verbose.apply(logger, args);
    };
    console.warn = function(...args: any) {
      return this.logger.warn.apply(logger, args);
    };
    console.error = function(...args: any) {
      return this.logger.error.apply(logger, args);
    };
  }

  use(req: Request, res: Response, next: Function) {
    if (isProduction()) {
      return this.prodLogger(req, res, next);
    } else {
      return this.devLogger(req, res, next);
    }
  }

  prodLogger = (req: Request, _res: Response, next: Function) => {
    this.logger.verbose(
      `${formatIp(req)} - ${req.ip} - ${req.method} - ${req.baseUrl}`,
    );
    next();
  };

  devLogger = (req: Request, _res: Response, next: Function) => {
    this.logger.verbose(
      `${formatIp(req)} - ${req.method} - ${req.baseUrl +
        (JSON.stringify(req.body) !== '{}'
          ? ' - ' + JSON.stringify(req.body)
          : '')}`,
    );
    next();
  };
}
