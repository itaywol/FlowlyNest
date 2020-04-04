import { Injectable } from '@nestjs/common';
import { AUTH_MODEL, DATABASE_PROVIDER } from 'src/constants';
import { Connection } from 'mongoose';
import { UserSchema } from 'src/schemas/user.schema';

export const authProvider = [
  {
    provide: AUTH_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [DATABASE_PROVIDER],
  },
];
