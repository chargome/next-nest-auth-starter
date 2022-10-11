import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as session from 'express-session';
import * as passport from 'passport';
import * as request from 'supertest';

export const setupApp = (app: INestApplication) => {
  // auth
  app.use(
    session({
      secret: 'my-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // todo: set to true in prod
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

export const getLoginCookie = async (
  app: INestApplication,
  email: string,
  password: string,
) => {
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password });

  const loginRes = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });
  return loginRes.get('Set-Cookie');
};

export const teardown = async (prisma: PrismaClient) => {
  await prisma.user.deleteMany();
};
