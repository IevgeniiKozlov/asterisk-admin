import { createUserSchema, outputUserSchema } from '../schemas/user.schema'
import { createUser } from '../services/user.service'
import { publicProcedure, router } from '../trpc'

export const userRouter = router({
  createUser: publicProcedure
    .input(createUserSchema)
    .output(outputUserSchema)
    .mutation(async ({ input }) => {
      return await createUser({ ...input })
    }),
})
