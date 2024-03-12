import expressLoader from './express';
import logger from './logger';
import type { Application } from 'express';

export default async ({ expressApp }: { expressApp: Application }) => {
  await expressLoader({ app: expressApp });
  logger.info('Express loaded');
};
