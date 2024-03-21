import db from '@/config/db';

const setupTestDB = () => {
  beforeEach(async () => {
    await db.deleteFrom('user').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });
};

export default setupTestDB;
