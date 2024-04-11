import prisma from '@/prisma/prisma-client'
import { TRPCError } from '@trpc/server'
import {
  ILoginAdmin,
  ILoginUser,
  IOutputAuth,
  ISignUpAdmin,
} from '../schemas/auth.schema'
import { createUser, validateAdmin, validateUser } from './user.service'

export const isExistAdmin = async (): Promise<void> => {
  const users = await prisma.user.findMany()
  if (users.length > 0) {
    throw new TRPCError({
      message: 'Уже есть зарегестрированный админ',
      code: 'NOT_FOUND',
    })
  }
}

export const signInAdmin = async (data: ILoginAdmin): Promise<IOutputAuth> => {
  return await validateAdmin(data)
}

export const signInUser = async (data: ILoginUser): Promise<IOutputAuth> => {
  return await validateUser(data)
}

export const signUpAdmin = async (data: ISignUpAdmin): Promise<IOutputAuth> => {
  return await createUser(data)
}
