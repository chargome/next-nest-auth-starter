import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';
import { getLoginCookie, setupApp, teardown } from './util';

describe('AuthController (e2e)', () => {
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

  it('/auth/register (POST)', async () => {
    const email = 'alb@ert.com';
    const name = 'Albert';
    const password = 'somepw';

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, name, password })
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.id).toBeDefined();
        expect(body.email).toEqual(email);
        expect(body.name).toEqual(name);
        expect(body.password).toBeUndefined();
      });
  });

  it('/auth/login (POST)', async () => {
    const email = 'alb@ert.com';
    const name = 'Albert';
    const password = 'somepw';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, name, password });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.id).toBeDefined();
        expect(body.email).toEqual(email);
        expect(body.password).toBeUndefined();
      });
  });

  it('/auth/me (GET)', async () => {
    const email = 'alb@ert.com';
    const password = 'somepw';
    const cookie = await getLoginCookie(app, email, password);

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.id).toBeDefined();
        expect(body.email).toEqual(email);
        expect(body.password).toBeUndefined();
      });
  });

  it('/auth/logout (POST)', async () => {
    const email = 'alb@ert.com';
    const password = 'somepw';
    const cookie = await getLoginCookie(app, email, password);

    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', cookie)
      .expect(205);
  });

  it('/auth/logout (POST) (unauthentiated)', async () => {
    return request(app.getHttpServer()).post('/auth/logout').expect(403);
  });
});
