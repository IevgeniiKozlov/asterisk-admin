/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, router } from '../trpc'
import { cdrRouter } from './cdr'

export const appRouter = router({
  cdr: cdrRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
