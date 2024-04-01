import prisma from '@/prisma/prisma-client'
import { TRPCError } from '@trpc/server'
import { ILoginAdmin, ILoginUser, ISignUpAdmin } from '../schemas/auth.schema'
import { createUser, validateAdmin, validateUser } from './user.service'

export const isExistAdmin = async () => {
  const users = await prisma.user.findMany()
  if (users.length > 0) {
    throw new TRPCError({
      message: 'Уже есть зарегестрированный админ',
      code: 'NOT_FOUND',
    })
  }
}

export const loginAdmin = async (data: ILoginAdmin) => {
  return await validateAdmin(data)
}

export const loginUser = async (data: ILoginUser) => {
  return await validateUser(data)
}

export const signUpAdmin = async (data: ISignUpAdmin) => {
  return await createUser(data)
}
