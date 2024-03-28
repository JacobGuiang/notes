import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface Database {
  user: UserTable;
  note: NoteTable;
}

export interface UserTable {
  id: Generated<number>;
  username: string;
  password: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface NoteTable {
  id: Generated<number>;
  user_id: number;
  content: string;

  // selected as a Date
  // can never be inserted
  // updated as RawBuilder<unknown> because im using sql`now()`
  updated_at: ColumnType<Date, never, RawBuilder<unknown>>;
}

export type Note = Selectable<NoteTable>;
export type NewNote = Insertable<NoteTable>;
export type NoteUpdate = Updateable<NoteTable>;
