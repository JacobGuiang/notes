import pino from 'pino';
import config from './config';

const logger = pino({
  level: config.env === 'development' ? 'debug' : 'info',
});

export default logger;
