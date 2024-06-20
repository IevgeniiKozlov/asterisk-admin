import { appRouter } from '@/app/api/trpc/trpc-router'
import { createCallerFactory } from './trpc-server'

const createCaller = createCallerFactory(appRouter)
export const serverClient = createCaller({
  user: null,
})
