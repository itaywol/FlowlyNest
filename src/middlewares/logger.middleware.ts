import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { isProduction } from '../main';

export function formatIp(req: Request) {
  return req.ip !== undefined ? req.ip.replace(/^.*:/, '') : 'NO.IP';
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('winston') private readonly logger: Logger) {}

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
    if (req.body.operationName !== 'IntrospectionQuery')
      this.logger.verbose(
        `${formatIp(req)} - ${req.method} - ${req.baseUrl +
          (JSON.stringify(req.body) !== '{}'
            ? ' - ' +
              JSON.stringify(
                req.body.operationName === 'IntrospectionQuery' ? {} : req.body,
              )
            : '')}`,
      );
    next();
  };
}
