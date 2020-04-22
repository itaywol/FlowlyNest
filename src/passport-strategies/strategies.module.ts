import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'user/user.module';

@Module({
    imports: [UserModule],
    providers: [LocalStrategy],
})
export class StrategiesModule {}