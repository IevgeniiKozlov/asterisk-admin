import prisma from '@/prisma/prisma-client'
import { ICdr, ICdrWithPagination, IPaginationCdr } from '../schemas/cdr.schema'

export const findAll = async (): Promise<ICdr[]> => {
  return await prisma.cdr.findMany({})
}

export const findWithPagination = async ({
  where,
  page = 1,
  limit = 1000000,
}: IPaginationCdr): Promise<ICdrWithPagination> => {
  const result = {
    itemsCount: 0,
    totalItems: 0,
    totalPages: 0,
    rangeStart: 0,
    rangeEnd: 0,
    items: [] as ICdr[],
  }

  const totalCdr = await prisma.cdr.findMany({
    where: { ...where },
  })

  result.totalItems = totalCdr.length
  result.totalPages = Math.ceil(totalCdr.length / limit)

  const cdr = await prisma.cdr.findMany({
    where: { ...where },
    take: limit,
    skip: limit * (page - 1),
  })

  result.items = cdr
  result.itemsCount = cdr.length
  result.rangeStart = cdr.length ? limit * (page - 1) : 0
  result.rangeEnd = cdr.length ? result.rangeStart + result.itemsCount : 0

  return result
}
