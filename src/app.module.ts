import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import { DatabaseModule } from './database/database.module';
import { PerformerModule } from './performer/performer.module';
import { PerformanceModule } from './performance/performance.module';
import { TransactionsModule } from './transactions/transactions.module';
import { winstonConfig } from './logger';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    GraphQLModule.forRoot({
      debug: false,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      autoSchemaFile: true,
      cors: false,
      context: ({ req, res, connection }) => ({ req, res, connection }),
    }),
    DatabaseModule,
    UserModule,
    PerformerModule,
    PerformanceModule,
    TransactionsModule,
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
