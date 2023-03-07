import { PrismaClient } from '@prisma/client'

export const asyncIncrementVisit = async (prisma: PrismaClient, chartid: string) =>
  prisma.chart.update({
    where: { chartid },
    data: { visits: { increment: 1 }, last_visit: new Date() },
  })
