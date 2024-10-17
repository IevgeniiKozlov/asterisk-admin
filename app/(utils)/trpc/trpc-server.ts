import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'
import { Context } from './context'

const trpc = initTRPC.context<Context>().create({
  transformer: SuperJSON,
})

export const procedure = trpc.procedure
const enforceUserIsAuthed = trpc.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
export const protectedProcedure = trpc.procedure.use(enforceUserIsAuthed)
export const router = trpc.router
export const createCallerFactory = trpc.createCallerFactory
export const mergeRouters = trpc.mergeRouters
