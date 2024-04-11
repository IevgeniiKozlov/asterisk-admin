import { procedure, router } from '@/app/(utils)/trpc/trpc-server'
import { z } from 'zod'
import { outputCdrSchema } from '../schemas/cdr.schema'
import { findAll } from '../services/cdr.service'

/**
 * Default selector for Cdr.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @link https://github.com/prisma/prisma/issues/9353
 */
// const defaultCdrSelect = {} satisfies Prisma.CdrSelect

export const cdrRouter = router({
  getListCdr: procedure
    .input(z.void())
    .output(z.array(outputCdrSchema))
    .query(async () => {
      return await findAll()
    }),
})
