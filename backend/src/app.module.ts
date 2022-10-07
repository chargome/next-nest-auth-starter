import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // only include properties in dto
      }),
    },
  ],
})
export class AppModule {}
