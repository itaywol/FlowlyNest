import * as winston from 'winston';
import { Request } from 'express';
import { formatIp } from './middlewares/logger.middleware';
const { combine, colorize, printf } = winston.format;

export const winstonConfig: winston.LoggerOptions = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    verbose: 4,
  },
  transports: [new winston.transports.Console()],
  level: 'verbose',
  format: combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY-HH:mm:ss' }),
    colorize(),
    printf(info => {
      const { timestamp, level, message } = info;
      const req: Request | undefined = info.req;
      let requestString = '';

      if (req !== undefined) {
        requestString = `-{ ip: ${formatIp(req)}`;
      }

      return `${timestamp}-${level}${requestString}: ${message}`;
    }),
  ),
};
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'white',
  debug: 'gray',
});
