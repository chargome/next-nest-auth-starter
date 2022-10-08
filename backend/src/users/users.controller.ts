import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  async user(@Param('id') id: string) {
    console.log('id: ', id);
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
    console.log('called');
    const users = await this.usersService.getUsers();
    return users;
  }

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    const newUser = await this.usersService.create(data);
    return newUser;
  }
}
