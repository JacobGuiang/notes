import { Pool } from 'pg';
import config from './config';
import logger from './logger';

const pool = new Pool({
  connectionString: config.postgres.url,
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
// eslint-disable-next-line @typescript-eslint/no-unused-vars
pool.on('error', (err, _client) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const query = (text: string) => pool.query(text);
const getClient = () => pool.connect();
const end = () => pool.end();

export default { query, getClient, end };
