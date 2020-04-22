import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import { DatabaseModule } from './database/database.module';
import { PerformerModule } from './performer/performer.module';
import { PerformanceModule } from './performance/performance.module';
import { TransactionsModule } from './transactions/transactions.module';
import { winstonConfig } from './logger';
import { StreamManagerModule } from './stream-manager/stream-manager.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { StrategiesModule } from 'passport-strategies/strategies.module';
import { PassportModule } from '@nestjs/passport';
import { UserDeserializerMiddleware } from 'middlewares/user-deserializer.middleware';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    PassportModule.register({ session: false }),
    DatabaseModule,
    UserModule,
    PerformerModule,
    PerformanceModule,
    TransactionsModule,
    StreamManagerModule,
    AuthModule,
    FileUploadModule,
    StrategiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserDeserializerMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
      .apply(LoggerMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
