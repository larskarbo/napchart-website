import { PrismaClient } from '@prisma/client'
import { customAlphabet } from 'nanoid'
const generateRandomId = (n) => customAlphabet('abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789', n)()

export const findUniqueId = async (prisma: PrismaClient) => {
  const chartid = generateRandomId(9)
  return prisma.chart.findUnique({ where: { chartid } }).then((chart) => {
    if (chart) {
      throw new Error('Not unique')
    }
    return chartid
  })
}
