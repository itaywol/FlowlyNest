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

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    DatabaseModule,
    UserModule,
    PerformerModule,
    PerformanceModule,
    TransactionsModule,
    StreamManagerModule,
    AuthModule,
    FileUploadModule,
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

