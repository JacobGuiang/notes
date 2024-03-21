import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  user: UserTable;
}

export interface UserTable {
  id: Generated<number>;
  username: string;
  password: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
