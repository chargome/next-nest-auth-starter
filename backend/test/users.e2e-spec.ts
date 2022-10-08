import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient, Prisma } from '@prisma/client';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });

  it('/users (POST)', () => {
    const email = 'alb@ert.com';
    const name = 'Albert';
    return request(app.getHttpServer())
      .post('/users')
      .send({ email, name })
      .expect(201)
      .then((res) => {
        const { email, id, name } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
        expect(name).toEqual(name);
      });
  });

  it('/users (GET)', async () => {
    const user1: Prisma.UserCreateInput = {
      email: 'alb@ert.com',
      name: 'Albert',
    };
    const user2: Prisma.UserCreateInput = {
      email: 'char@gome.com',
      name: 'Charly',
    };
    await prisma.user.create({ data: user1 });
    await prisma.user.create({ data: user2 });

    return request(app.getHttpServer())
      .get(`/users`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveLength(2);
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
    };
    const createRes = await prisma.user.create({ data: user1 });

    return request(app.getHttpServer())
      .get(`/users/${createRes.id}`)
      .expect(200)
      .then((res) => {
        console.log(res.body);
        expect(res.body.id).toEqual(createRes.id);
        expect(res.body.email).toEqual(createRes.email);
        expect(res.body.name).toEqual(createRes.name);
      });
  });
});
