import { Module } from '@nestjs/common';
import { databaseProviders } from './database';

@Module({ imports: [...databaseProviders] })
export class DatabaseModule {}
