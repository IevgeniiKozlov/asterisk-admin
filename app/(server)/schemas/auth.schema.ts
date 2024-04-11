import { z } from 'zod'

/* Admin */
export const loginAdminSchema = z.object({
  login: z.string().email(),
  password: z.string().min(4).max(12),
})

export const signUpAdminSchema = loginAdminSchema.extend({
  name: z.string().min(1),
  role: z.string().min(1),
})

export type ILoginAdmin = z.TypeOf<typeof loginAdminSchema>
export type ISignUpAdmin = z.TypeOf<typeof signUpAdminSchema>

/* User */
export const loginUserSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(4).max(12),
})

export const outputAuthSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  login: z.string().min(1),
  password: z.string().min(1),
  operators: z.array(z.string()),
  role: z.string().min(1),
})

export const resetPasswordSchema = z.object({
  userId: z.string().min(1),
  password: z.string().min(4).max(12),
})

export type ILoginUser = z.TypeOf<typeof loginUserSchema>

export type IOutputAuth = z.TypeOf<typeof outputAuthSchema>
export type IResetPassword = z.TypeOf<typeof resetPasswordSchema>
