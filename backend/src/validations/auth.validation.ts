import { z } from 'zod';

const login = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Username is required' })
      .min(1, 'Username cannot be empty'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});
export type LoginBody = z.infer<typeof login.shape.body>;

export default { login };
