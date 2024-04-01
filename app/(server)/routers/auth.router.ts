import { procedure, router } from '@/app/(utils)/trpc/trpc-server'
import { z } from 'zod'
import {
  loginAdminSchema,
  loginUserSchema,
  outputAuthSchema,
  signUpAdminSchema,
} from '../schemas/auth.schema'
import {
  isExistAdmin,
  loginAdmin,
  loginUser,
  signUpAdmin,
} from '../services/auth.service'

export const authRouter = router({
  loginAdmin: procedure
    .input(loginAdminSchema)
    .output(outputAuthSchema)
    .mutation(async ({ input }) => {
      console.log('test')
      return await loginAdmin({ ...input })
    }),
  loginUser: procedure
    .input(loginUserSchema)
    .output(outputAuthSchema)
    .mutation(async ({ input }) => {
      return await loginUser({ ...input })
    }),
  registerAdmin: procedure
    .input(signUpAdminSchema)
    .output(z.void())
    .mutation(async ({ input }) => {
      await isExistAdmin()
      await signUpAdmin({ ...input })
    }),
})
