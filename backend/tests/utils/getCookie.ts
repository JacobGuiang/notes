import { LoginBody } from '@/validations/auth.validation';
import request from 'supertest';
import app from '@/app';

const getCookie = async (credentials: LoginBody) => {
  const res = await request(app)
    .post('/auth/login')
    .send(credentials)
    .expect(200);

  return res.headers['set-cookie'];
};

export default getCookie;
