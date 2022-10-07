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
    const userId = +id;
    if (!userId) {
      throw new BadRequestException();
    }

    const user = await this.usersService.getUserById(+id);

    if (!user) {
      throw new NotFoundException('user not found');
    }
  }

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return await this.usersService.create(data);
  }
}
