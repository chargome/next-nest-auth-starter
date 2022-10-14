import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: 'http://localhost:3000' },
  });

  // auth
  app.use(
    session({
      secret: 'my-secret', // todo: use env
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // todo: set to true in prod
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // start
  await app.listen(4000);
}
bootstrap();
