import { procedure, router } from '@/app/(utils)/trpc/trpc-server'
import { z } from 'zod'
import { outputCdrSchema } from '../schemas/cdr.schema'
import { findAll } from '../services/cdr.service'

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @link https://github.com/prisma/prisma/issues/9353
 */
// const defaultCdrSelect = {
//   id: true,
//   title: true,
//   text: true,
//   createdAt: true,
//   updatedAt: true,
// } satisfies Prisma.CdrSelect

export const cdrRouter = router({
  getListCdr: procedure
    .input(z.void())
    .output(z.array(outputCdrSchema))
    .query(async () => {
      console.log('test')
      return await findAll()
    }),
})
