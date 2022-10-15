import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session-serializer';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  imports: [UsersModule, PassportModule.register({ session: true })],
  exports: [AuthService],
})
export class AuthModule {}
