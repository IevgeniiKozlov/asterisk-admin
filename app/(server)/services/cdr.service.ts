import prisma from '@/prisma/prisma-client'
import { ICdr } from '../schemas/cdr.schema'

export const findAll = async (): Promise<ICdr[]> => {
  return await prisma.cdr.findMany({})
}
