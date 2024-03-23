import type { Knex } from 'knex';
import 'dotenv/config';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_TEST_URL,
  },
};

export default config;
