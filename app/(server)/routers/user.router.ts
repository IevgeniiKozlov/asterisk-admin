import { procedure, router } from '@/app/(utils)/trpc/trpc-server'
import { z } from 'zod'
import { createUserSchema, outputUserSchema } from '../schemas/user.schema'
import { createUser, findAllUsers } from '../services/user.service'

export const userRouter = router({
  getListUsers: procedure
    .input(z.void())
    .output(z.array(outputUserSchema))
    .query(async () => {
      return await findAllUsers()
    }),
  registerUser: procedure
    .input(createUserSchema)
    .output(outputUserSchema)
    .mutation(async ({ input }) => {
      return await createUser({ ...input })
    }),
})
