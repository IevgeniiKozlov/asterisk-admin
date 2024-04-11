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
  signInAdmin,
  signInUser,
  signUpAdmin,
} from '../services/auth.service'

export const authRouter = router({
  loginAdmin: procedure
    .input(loginAdminSchema)
    .output(outputAuthSchema)
    .mutation(async ({ input }) => {
      return await signInAdmin({ ...input })
    }),
  loginUser: procedure
    .input(loginUserSchema)
    .output(outputAuthSchema)
    .mutation(async ({ input }) => {
      return await signInUser({ ...input })
    }),
  registerAdmin: procedure
    .input(signUpAdminSchema)
    .output(z.void())
    .mutation(async ({ input }) => {
      await isExistAdmin()
      await signUpAdmin({ ...input })
    }),
})
