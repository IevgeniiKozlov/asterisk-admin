import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1),
  login: z.string(),
  password: z.string().min(4).max(12),
  role: z.string().min(1),
})

export const updateUserSchema = createUserSchema.extend({
  id: z.number(),
})

export const outputUserSchema = updateUserSchema.extend({})

export type ICreateUser = z.TypeOf<typeof createUserSchema>
export type IUpdateUser = z.TypeOf<typeof updateUserSchema>
export type IOutputUser = z.TypeOf<typeof outputUserSchema>
