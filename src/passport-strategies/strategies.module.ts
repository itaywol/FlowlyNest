import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'user/user.module';
import { FacebookStartegy } from './facebook.startegy';

@Module({
    imports: [UserModule],
    providers: [LocalStrategy, FacebookStartegy],
})
export class StrategiesModule {}