import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

export async function createUser(data: User) {
  try {
    const user = await prisma.user.create({ data })
    return { user }
  } catch (error) {
    return { error }
  }
}

export async function getUserById(id: string) {
  try {
    const todo = await prisma.user.findUnique({ where: { id } })
    return { todo }
  } catch (error) {
    return { error }
  }
}

export async function UpdateUser(id: string, data: User) {
  try {
    const todo = await prisma.user.update({
      where: { id },
      data
    })
    return { todo }
  } catch (error) {
    return { error }
  }
}
