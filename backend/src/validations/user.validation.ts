import { z } from 'zod';
import validator from 'validator';

const username = z
  .string({ required_error: 'Username is required' })
  .min(1, 'Username cannot be empty')
  .refine((val) => validator.isAlphanumeric(val), {
    message: 'Username can only have letters and numbers',
  })
  .transform((val) => val.toLowerCase());

const password = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .refine((val) => !validator.isLowercase(val), {
    message: 'Password must have at least one uppercase letter',
  })
  .refine((val) => !validator.isUppercase(val), {
    message: 'Password must have at least one lowercase letter',
  })
  .refine((val) => /\d/.test(val), {
    message: 'Password must have at least one number',
  })
  .refine((val) => !validator.isAlphanumeric(val), {
    message: 'Password must have at least one symbol',
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
      { message: 'Body has no properties' }
    ),
});

export default { createUser, updateUser };
