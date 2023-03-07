import { PrismaClient } from '@prisma/client'

export const deleteChart = async function (req, res) {
  const { chartid } = req.params
  const prisma = new PrismaClient()
  console.log('chartid: ', chartid)

  const username = req.user.username

  if (!username) {
    return res.status(401).send({ message: 'No username' })
  }

  const chart = await prisma.chart.findFirst({
    where: {
      chartid: chartid,
    },
  })

  if (!chart) {
    res.status(404).send({ message: "The chart doesn't exist" })
    return
  }

  if (chart.username !== username) {
    res.status(401).send({ message: 'No permission for deleting this chart' })
    return
  }

  await prisma.chart.update({
    where: {
      chartid: chartid,
    },
    data: {
      deleted: true,
    },
  })

  res.send({
    deleted: true,
  })
}
