import { z } from 'zod';
import validator from 'validator';

const username = z
  .string()
  .refine((val) => validator.isAlphanumeric(val), {
    message: 'must only contain letters and numbers',
  })
  .transform((val) => val.toLowerCase());

const password = z.string().refine((val) => validator.isStrongPassword(val), {
  message: 'is not strong',
});

const createUser = z.object({
  body: z.object({
    username,
    password,
  }),
});

const updateUser = z.object({
  body: z
    .object({
      username,
      password,
    })
    .partial()
    .refine(
      ({ username, password }) =>
        username !== undefined || password !== undefined,
      { message: 'has no properties' }
    ),
});

export default { createUser, updateUser };
