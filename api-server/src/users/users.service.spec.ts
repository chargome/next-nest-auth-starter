import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

const mockUsers: User[] = [
  { id: 1, name: 'Albert', email: 'al@bert.com', password: 'pass' },
  { id: 2, name: 'Alberto', email: 'al@berto.com', password: '1234' },
];

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: (data: any) =>
          Promise.resolve(mockUsers.find((user) => user.id === data.where.id)),
        create: (data: any) => Promise.resolve({ ...data.data, id: 3 }),
        findMany: () => Promise.resolve(mockUsers),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return single user', async () => {
    const res = await service.getUserById(1);
    expect(res).toBeDefined();
    expect(res.id).toEqual(1);
    expect(res.email).toBeDefined();
  });

  it('should return null when no user is found', async () => {
    const res = await service.getUserById(11);
    expect(res).not.toBeDefined();
  });

  it('should create user', async () => {
    const data = { email: 'my@mail.com', name: 'Charles', password: 'geheim' };
    const res = await service.createUser(data);
    expect(res).toBeDefined();
    expect(res.id).toBeDefined();
    expect(res.email).toEqual(data.email);
    expect(res.name).toEqual(data.name);
  });

  it('should return all users', async () => {
    const res = await service.getUsers();
    expect(res).toBeDefined();
    expect(res).toHaveLength(mockUsers.length);
  });
});
