import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';

const scrypt = promisify(_scrypt);

// key length used for the password hashing algo
const KEY_LENGTH = 32;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(email: string, plaintextPassword: string, name: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('user already exists');
    }

    const hashedPassword = await this.generateHashedAndSaltedPassword(
      plaintextPassword,
    );

    return this.usersService.createUser({
      email,
      password: hashedPassword,
      name,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const [salt] = user.password.split('.');
    const hash = await this.generateHashedAndSaltedPassword(password, salt);

    if (hash === user.password) {
      return user;
    }

    return null;
  }

  async generateHashedAndSaltedPassword(
    passwordInPlaintext: string,
    existingSalt?: string,
  ) {
    const salt = existingSalt || randomBytes(8).toString('hex');
    const hash = (await scrypt(
      passwordInPlaintext,
      salt,
      KEY_LENGTH,
    )) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    return result;
  }
}
