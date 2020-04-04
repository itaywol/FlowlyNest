import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { Request } from 'express';
import { formatIp, LoggerMiddleware } from './middlewares/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import { DatabaseModule } from './database/database.module';
import { PerformerModule } from './performer/performer.module';
import { PerformanceModule } from './performance/performance.module';
import * as winston from 'winston';
const { combine, colorize, printf } = winston.format;

const winstonConfig: winston.LoggerOptions = {
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

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      autoSchemaFile: true,
    }),
    AuthModule,
    DatabaseModule,
    PerformerModule,
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
