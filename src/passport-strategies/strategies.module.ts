import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'user/user.module';
import { FacebookStartegy } from './facebook.startegy';
import { GoogleStartegy } from './google.strategy';

@Module({
    imports: [UserModule],
    providers: [LocalStrategy, FacebookStartegy, GoogleStartegy],
})
export class StrategiesModule {}