import { authRouter } from '@/app/(server)/routers/auth.router'
import { cdrRouter } from '@/app/(server)/routers/cdr.router'
import { userRouter } from '@/app/(server)/routers/user.router'
import {
  createCallerFactory,
  mergeRouters,
  procedure,
  router,
} from '@/app/(utils)/trpc/trpc-server'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { Session } from 'next-auth'
import SuperJSON from 'superjson'

const healthCheckerRouter = router({
  healthchecker: procedure.query(({ ctx }) => {
    return {
      status: 'success',
      message: 'Welcome to trpc with Next.js 14 and React Query',
    }
  }),
})

export const appRouter = mergeRouters(
  authRouter,
  userRouter,
  cdrRouter,
  healthCheckerRouter,
)

export const createSSRHelper = (session: Session | null) =>
  createServerSideHelpers({
    router: appRouter,
    transformer: SuperJSON,
    ctx: { session: session },
  })

export const createCaller = createCallerFactory(authRouter)

export type AppRouter = typeof appRouter
