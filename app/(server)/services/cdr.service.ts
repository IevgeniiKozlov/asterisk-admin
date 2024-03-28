import { prisma } from '../prisma'
import { ICdr } from '../schemas/cdr.schema'

export const findAll = async (): Promise<ICdr[]> => {
  return await prisma.cdr.findMany({})
}
