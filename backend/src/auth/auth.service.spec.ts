import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsers: User[];

  beforeEach(async () => {
    mockUsers = [];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: (email: string) =>
              mockUsers.find((user) => user.email === email),
            createUser: (user: any) => user,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create salted and hashed password', async () => {
    const plaintextPassword = 'topsecret';
    const res = await service.generateHashedAndSaltedPassword(
      plaintextPassword,
    );
    expect(res).toBeDefined();
    expect(res).toHaveLength(81);
    expect(res.includes('.')).toBe(true);
    expect(res.includes(plaintextPassword)).toBe(false);
  });

  it('should validate user', async () => {
    const mockUser = {
      email: 'al@bert.com',
      name: 'albert',
      id: 1,
      password:
        'd7314955aed3159d.976ce9c562307368afb7fc89b3abd35469b489d7638b0414bcf5b2edde05e00e', // "geheim"
    };
    mockUsers.push(mockUser);

    const res = await service.validateUser(mockUser.email, 'geheim');
    expect(res).toBeDefined();
    expect(res.id).toEqual(mockUser.id);
  });

  it('should not validate user', async () => {
    const mockUser = {
      email: 'al@bert.com',
      name: 'albert',
      id: 1,
      password:
        'd7314955aed3159d.976ce9c562307368afb7fc89b3abd35469b489d7638b0414bcf5b2edde05e00e', // "geheim"
    };
    mockUsers.push(mockUser);

    const res = await service.validateUser(mockUser.email, '1234');
    expect(res).toBeNull();
  });

  it('should create user', async () => {
    const email = 'al@bert.com';
    const name = 'albert';
    const password = 'geheim';
    const res = await service.register(email, password, name);
    expect(res).toBeDefined();
    expect(res.password.includes(password)).toEqual(false);
    const [salt, hash] = res.password.split('.');
    expect(salt.length).toBeGreaterThan(1);
    expect(hash.length).toBeGreaterThan(1);
  });

  it('should not create user when email already exists', async () => {
    const mockUser = {
      email: 'al@bert.com',
      name: 'albert',
      id: 1,
      password:
        'd7314955aed3159d.976ce9c562307368afb7fc89b3abd35469b489d7638b0414bcf5b2edde05e00e', // "geheim"
    };
    mockUsers.push(mockUser);
    const email = 'al@bert.com';
    const name = 'albert';
    const password = 'geheim';
    await expect(
      service.register(email, password, name),
    ).rejects.toThrowError();
  });
});
