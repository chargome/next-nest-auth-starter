import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsers: User[] = [
  { id: 1, name: 'Albert', email: 'al@bert.com' },
  { id: 2, name: 'Alberto', email: 'al@berto.com' },
];

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const mockUserService = {
      getUserById: (id: number) =>
        Promise.resolve(mockUsers.find((user) => user.id === id)),
      createUser: (data: any) => Promise.resolve({ ...data, id: 3 }),
      getUsers: () => Promise.resolve(mockUsers),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return single user', async () => {
    const res = await controller.user('1');
    expect(res).toBeDefined();
    expect(res.id).toEqual(1);
    expect(res.email).toEqual(mockUsers[0].email);
    expect(res.name).toEqual(mockUsers[0].name);
  });

  it('should return throw when user id is null', async () => {
    await expect(controller.user(null)).rejects.toThrowError();
  });

  it('should return throw when user is not found', async () => {
    await expect(controller.user('11')).rejects.toThrowError();
  });

  it('should return users', async () => {
    const res = await controller.users();
    expect(res).toBeDefined();
    expect(res).toHaveLength(2);
  });

  it('should create user', async () => {
    const email = 'bobo@banani.com';
    const name = 'bobo';
    const res = await controller.createUser({ email, name });
    expect(res).toBeDefined();
    expect(res.email).toEqual(email);
    expect(res.name).toEqual(name);
    expect(res.id).toBeDefined();
  });
});
