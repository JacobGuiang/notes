import { z } from 'zod';

const login = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});
export type LoginBody = z.infer<typeof login.shape.body>;

export default { login };
