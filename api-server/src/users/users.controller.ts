import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  async user(@Param('id') id: string) {
    const userId = +id;
    if (!userId) {
      throw new BadRequestException();
    }

    const user = await this.usersService.getUserById(+id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Get()
  async users() {
    const users = await this.usersService.getUsers();
    return users;
  }
}
