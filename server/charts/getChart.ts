import { ChartData, ChartDocument } from '../../web/src/components/Editor/types'
import { getPrisma } from '../src/utils/prisma'
import { getProperLink } from '../utils/getProperLink'
import { WEB_BASE } from '../utils/webBase'
import { ChartCreationReturn } from './types'
import { asyncIncrementVisit } from './utils/asyncIncrementVisit'

export const getChart = async function (req, res) {
  const chartid = req.params.chartid

  const prisma = getPrisma()
  const chart = await prisma.chart.findFirst({
    where: {
      chartid: chartid,
      deleted: false,
    },
  })

  if (!chart) {
    return res.status(404).send({
      message: 'not found',
    })
  }

  asyncIncrementVisit(prisma, chartid)

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

  if (chartDocument.isPrivate && chartDocument.username != req.user?.username) {
    return res.status(401).send({
      message: 'The chart is private',
    })
  }

  const sendThis: ChartCreationReturn = {
    chartDocument,
    publicLink:
      WEB_BASE +
      (chartDocument.isSnapshot
        ? `/snapshot/${chartDocument.chartid}`
        : getProperLink(chartDocument.username, chartDocument.title, chartDocument.chartid)),
  }

  res.send(sendThis)
}
