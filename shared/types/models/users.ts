import type { Builder } from 'sutando';
import { Model, compose, HasUniqueIds } from 'sutando';
import { generateUniqueString } from '~~/shared/utils/generateUniqueString';
import { keyLength } from '~~/shared/utils/keyLength';
import { Credential } from './credentials';
export class User extends compose(Model, HasUniqueIds) {
  override table = 'users';
  override keyType = 'string';
  override incrementing = false;
  override newUniqueId() {
    return generateUniqueString(keyLength('users'));
  }

  //  !: is for definite assignment assertion, used when you know you'll assign the property later.
  //declare is for type declaration only; it won’t emit code for the property and is often used for interoperability or type - only scenarios.

  id!: string;
  name!: string;
  email!: string;
  password!: string;
  verified!: string;
  role!: string;

  override attributes = {
    role: 'user',
    verified: '0',
  };

  override hidden = [
    'password'
  ];

  casts = {
    // Note: verified is stored as text but represents a datetime
    // role is an enum: 'user' | 'admin'
  };

  scopeEmail(query: Builder<User>, email: string) {
    return query.where('email', email);
  }

  isVerified() {
    return this.verified ? true : false;
  }

  relationCredentials() {
    return this.hasMany(Credential, 'user_id');
  }
}