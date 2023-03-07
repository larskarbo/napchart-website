import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient // declare prisma variable as singleton

export const getPrisma = (): PrismaClient => {
  if (!prisma) {
    // if prisma is not already instantiated
    prisma = new PrismaClient() // instantiate prisma
  }
  return prisma // return singleton instance of prisma
}
