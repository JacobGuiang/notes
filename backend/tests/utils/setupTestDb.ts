import db from '@/config/db';

const setupTestDB = () => {
  afterAll(async () => {
    await db.destroy();
  });
};

export default setupTestDB;
