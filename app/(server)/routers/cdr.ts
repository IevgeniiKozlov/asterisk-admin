import { z } from 'zod'
import { outputCdrSchema } from '../schemas/cdr.schema'
import { findAll } from '../services/cdr.service'
import { publicProcedure, router } from '../trpc'

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
  getList: publicProcedure
    .input(z.void())
    .output(z.array(outputCdrSchema))
    .query(async () => {
      return await findAll()
    }),
  // getByFilters: publicProcedure
  //   .input(z.object({}))
  //   .query(async ({ input }) => {}),
})
