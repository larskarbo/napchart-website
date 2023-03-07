import { PrismaClient } from '@prisma/client'
import { ChartData, ChartDocument } from '../../web/src/components/Editor/types'
import { getPrisma } from '../src/utils/prisma'

export const getChartsFromUser = async function (req, res) {
  const { username } = req.params
  const prisma = getPrisma()

  if (username === 'anonymous' || username === 'thumbbot') {
    return res.status(404).send({ message: "Can't get charts from this user" })
  }

  const isMe = req.user && username === req.user?.username

  const charts = await prisma.chart.findMany({
    where: {
      username: username,
      is_snapshot: false,
      deleted: false,
      ...(isMe ? {} : { is_private: false }),
    },
    orderBy: {
      created_at: 'asc',
    },
    take: 100,
  })

  if (!charts.length) {
    return res.status(404).send({ message: "Can't find charts from this user" })
  }

  const chartDocuments: ChartDocument[] = charts.map((chart) => {
    const chartDocument: ChartDocument = {
      chartData: chart.chart_data as unknown as ChartData,
      chartid: chart.chartid,
      title: chart.title,
      description: chart.description,
      username: chart.username,
      lastUpdated: chart.updated_at,
      isSnapshot: chart.is_snapshot,
      isPrivate: chart.is_private,
    }
    return chartDocument
  })

  res.send(chartDocuments)
}
