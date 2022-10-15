import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient, Prisma } from '@prisma/client';
import { getLoginCookie, setupApp, teardown } from './util';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterEach(async () => {
    await teardown(prisma);
  });

  it('/users (GET)', async () => {
    const user1: Prisma.UserCreateInput = {
      email: 'alb@ert.com',
      name: 'Albert',
      password: 'somepw',
    };
    const user2: Prisma.UserCreateInput = {
      email: 'char@gome.com',
      name: 'Charly',
      password: 'somepw',
    };
    await prisma.user.create({ data: user1 });
    await prisma.user.create({ data: user2 });

    const cookie = await getLoginCookie(app, 'my@mail.com', 'geheim');

    return request(app.getHttpServer())
      .get(`/users`)
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveLength(3);
        expect(res.body[0].id).toBeDefined();
        expect(res.body[0].email).toEqual(user1.email);
        expect(res.body[0].name).toEqual(user1.name);
        expect(res.body[1].id).toBeDefined();
        expect(res.body[1].email).toEqual(user2.email);
        expect(res.body[1].name).toEqual(user2.name);
      });
  });

  it('/users/[id] (GET)', async () => {
    const user1: Prisma.UserCreateInput = {
      email: 'alb@ert.com',
      name: 'Albert',
      password: 'ABC123',
    };
    const createRes = await prisma.user.create({ data: user1 });

    const cookie = await getLoginCookie(app, 'my@mail.com', 'geheim');

    return request(app.getHttpServer())
      .get(`/users/${createRes.id}`)
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toEqual(createRes.id);
        expect(res.body.email).toEqual(createRes.email);
        expect(res.body.name).toEqual(createRes.name);
      });
  });
});
