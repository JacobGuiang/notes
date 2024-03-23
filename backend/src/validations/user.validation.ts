import { z } from 'zod';
import validator from 'validator';

const createUser = z.object({
  body: z.object({
    username: z
      .string()
      .refine((val) => validator.isAlphanumeric(val), {
        message: 'username must only contain letters and numbers',
      })
      .transform((val) => val.toLowerCase()),
    password: z.string().refine((val) => validator.isStrongPassword(val), {
      message: 'password is not strong',
    }),
  }),
});

// const getUser = z.object({
//   params: z
//     .object({
//       userId: z
//         .number()
//         .or(z.string())
//         .pipe(z.coerce.number().positive().int()),
//     })
//     .partial(),
// });

// const updateUser = z.object({
//   params: z.object({
//     userId: z.number().or(z.string()).pipe(z.coerce.number().positive().int()),
//   }),
//   body: z
//     .object({
//       username: z.string().refine((val) => validator.isAlphanumeric(val), {
//         message: 'username must only contain letters and numbers',
//       }),
//       password: z.string().refine((val) => validator.isStrongPassword(val), {
//         message: 'password is not strong',
//       }),
//     })
//     .partial()
//     .refine(
//       ({ username, password }) =>
//         username !== undefined || password !== undefined,
//       { message: 'body has no properties' }
//     ),
// });

// const deleteUser = z.object({
//   params: z
//     .object({
//       userId: z
//         .number()
//         .or(z.string())
//         .pipe(z.coerce.number().positive().int()),
//     })
//     .partial(),
// });

export default { createUser };
