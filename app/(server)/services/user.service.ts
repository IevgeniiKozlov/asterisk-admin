import prisma from '@/prisma/prisma-client'
import { TRPCError } from '@trpc/server'
import { compare, hash } from 'bcryptjs'
import { ILoginUser } from '../schemas/auth.schema'
import { ICreateUser } from '../schemas/user.schema'
import { IOutputUser } from './../schemas/user.schema'

export const findAllUsers = async (): Promise<IOutputUser[]> => {
  return await prisma.user.findMany({
    where: { role: 'user' },
  })
}

export const validateAdmin = async (data: ILoginUser): Promise<IOutputUser> => {
  const user: IOutputUser | null = await prisma.user.findUnique({
    where: {
      login: data.login,
      role: 'admin',
    },
  })

  if (!user) {
    throw new TRPCError({
      message: `Админ с электронной почтой ${data.login} не найден`,
      code: 'NOT_FOUND',
    })
  }

  if (user && (await compare(data.password, user.password as string))) {
    return user
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' })
}

export const validateUser = async (data: ILoginUser): Promise<IOutputUser> => {
  const user: IOutputUser | null = await prisma.user.findUnique({
    where: {
      login: data.login,
      role: 'user',
    },
  })

  if (!user) {
    throw new TRPCError({
      message: `Пользователь с логином ${data.login} не найден`,
      code: 'NOT_FOUND',
    })
  }

  if (user && (await compare(data.password, user.password as string))) {
    return user
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' })
}

export const createUser = async (data: ICreateUser): Promise<IOutputUser> => {
  const user: IOutputUser | null = await prisma.user.findUnique({
    where: {
      login: data.login,
    },
  })

  if (user) {
    throw new TRPCError({
      message: `${data.role === 'admin' ? 'Админ с электронной почтой' : 'Пользователь с логином'} "${data.login}" уже существует`,
      code: 'FORBIDDEN',
    })
  }

  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: await hash(data.password, 10),
    },
  })

  return newUser
}
