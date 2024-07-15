import { protectedProcedure, router } from '@/app/(utils)/trpc/trpc-server'
import { z } from 'zod'
import {
  createUserSchema,
  outputUserSchema,
  updateUserSchema,
} from '../schemas/user.schema'
import {
  createUser,
  findAllUsers,
  removeUser,
  updateUser,
} from '../services/user.service'

export const userRouter = router({
  getListUsers: protectedProcedure
    .input(z.void())
    .output(z.array(outputUserSchema))
    .query(async () => {
      return await findAllUsers()
    }),
  registerUser: protectedProcedure
    .input(createUserSchema)
    .output(outputUserSchema)
    .mutation(async ({ input }) => {
      return await createUser({ ...input })
    }),
  updateUser: protectedProcedure
    .input(updateUserSchema)
    .output(outputUserSchema)
    .mutation(async ({ input }) => {
      return await updateUser({ ...input })
    }),
  removeUser: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const id = await removeUser(input.id)
      return { id }
    }),
})
