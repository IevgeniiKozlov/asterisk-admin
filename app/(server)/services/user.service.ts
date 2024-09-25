import prisma from '@/prisma/prisma-client'
import { TRPCError } from '@trpc/server'
import { compare, hash } from 'bcryptjs'
import { ILoginUser } from '../schemas/auth.schema'
import { ICreateUser, IUpdateUser } from '../schemas/user.schema'
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

export const findByIdUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) {
    throw new TRPCError({
      message: `Пользователь с ID "${id}" не найден`,
      code: 'NOT_FOUND',
    })
  }

  return user
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

export const updateUser = async (data: IUpdateUser): Promise<IOutputUser> => {
  const { id, password, ...restData } = data
  await findByIdUser(id)

  const user = await prisma.user.findUnique({
    where: {
      login: data.login,
    },
  })

  if (data.login === user?.login && data.id !== user?.id) {
    throw new TRPCError({
      message: `Пользователь с логином ${data.login} уже существует`,
      code: 'FORBIDDEN',
    })
  }

  const newData = password
    ? { ...restData, password: await hash(password, 10) }
    : restData

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...newData,
    },
  })

  return updatedUser
}

export const removeUser = async (id: number) => {
  const user = await prisma.user.delete({ where: { id } }).catch(() => {
    throw new TRPCError({
      message: `Пользователь с ID ${id} не найден`,
      code: 'NOT_FOUND',
    })
  })

  return user.id
}
