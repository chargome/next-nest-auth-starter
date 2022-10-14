import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Req,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionUser } from './session-serializer';

interface UserRequest extends Request {
  user: SessionUser;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Serialize(UserDto)
  @Post('/register')
  async register(@Body() { email, password, name }: RegisterDto) {
    return this.authService.register(email, password, name);
  }

  @Serialize(UserDto)
  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: UserRequest) {
    return req.user;
  }

  @Serialize(UserDto)
  @Get('/me')
  @UseGuards(AuthenticatedGuard)
  me(@Req() req: UserRequest) {
    return req.user;
  }

  @Post('/logout')
  @UseGuards(AuthenticatedGuard)
  @HttpCode(205)
  async logout(@Req() req: Request) {
    req.logout((err: any) => {
      if (err) {
        throw new BadRequestException();
      }
      return { success: true };
    });
  }
}
