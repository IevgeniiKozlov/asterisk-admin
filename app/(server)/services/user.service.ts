import { TRPCError } from '@trpc/server'
import { compare, hash } from 'bcryptjs'
import { prisma } from '../prisma'
import { ILoginUser } from '../schemas/auth.schema'
import { ICreateUser } from '../schemas/user.schema'

export const validateAdmin = async (data: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      login: data.login,
    },
  })

  if (!user) {
    throw new TRPCError({
      message: `Admin with email ${data.login} was not found`,
      code: 'NOT_FOUND',
    })
  }

  if (user && (await compare(data.password, user.password as string))) {
    return user
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' })
}

export const validateUser = async (data: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      login: data.login,
    },
  })

  if (!user) {
    throw new TRPCError({
      message: `User with login ${data.login} was not found`,
      code: 'NOT_FOUND',
    })
  }

  if (user && (await compare(data.password, user.password as string))) {
    return user
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' })
}

export const createUser = async (data: ICreateUser) => {
  const user = await prisma.user.findUnique({
    where: {
      login: data.login,
    },
  })

  if (user) {
    throw new TRPCError({
      message: `${data.role === 'admin' ? 'Admin with email' : 'User with login'} "${data.login}" already exists`,
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
