import { procedure, router } from '@/app/(utils)/trpc/trpc-server'
import { createUserSchema, outputUserSchema } from '../schemas/user.schema'
import { createUser } from '../services/user.service'

export const userRouter = router({
  createUser: procedure
    .input(createUserSchema)
    .output(outputUserSchema)
    .mutation(async ({ input }) => {
      console.log('test', input)
      return await createUser({ ...input })
    }),
})
