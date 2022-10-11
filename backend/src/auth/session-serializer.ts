import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';

export interface SessionUser {
  id: number;
  email: string;
  name?: string;
}

/**
 * defines the how the user is stored in the session
 */
@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: User,
    done: (err: Error, user: SessionUser) => void,
  ): any {
    done(null, {
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  deserializeUser(
    payload: SessionUser,
    done: (err: Error, payload: SessionUser) => void,
  ): any {
    done(null, payload);
  }
}
