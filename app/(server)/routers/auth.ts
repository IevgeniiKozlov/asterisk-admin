import {
  loginAdminSchema,
  loginUserSchema,
  outputAuthSchema,
  signUpAdminSchema,
} from '../schemas/auth.schema'
import { loginAdmin, loginUser, signUpAdmin } from '../services/auth.service'
import { publicProcedure, router } from '../trpc'

export const authRouter = router({
  loginAdmin: publicProcedure
    .input(loginAdminSchema)
    .output(outputAuthSchema)
    .mutation(async ({ input }) => {
      return await loginAdmin({ ...input })
    }),
  loginUser: publicProcedure
    .input(loginUserSchema)
    .output(outputAuthSchema)
    .mutation(async ({ input }) => {
      return await loginUser({ ...input })
    }),
  registerAdmin: publicProcedure
    .input(signUpAdminSchema)
    .output(outputAuthSchema)
    .mutation(async ({ input }) => {
      return await signUpAdmin({ ...input })
    }),
  // forgetPassword: publicProcedure
  //   .input(z.object({ email: z.string().email() }))
  //   // .output(z.object({ link: z.string().min(1) }))
  //   .mutation(async ({ input }) => {}),
  // resetPassword: publicProcedure
  //   .input(resetPasswordSchema)
  //   // .output(z.object({ success: z.boolean() }))
  //   .mutation(async ({ input }) => {}),
})
