import { Canvas, Path2D } from 'skia-canvas'
import Napchart from '../../web/napchart-canvas/lib/index'
import { ChartData, ChartDocument } from '../../web/src/components/Editor/types'
import { getPrisma } from '../src/utils/prisma'
import { asyncIncrementVisit } from './utils/asyncIncrementVisit'

export const getImage = async function (req, res) {
  const chartid = req.params.chartid
  const prisma = getPrisma()
  var hr = req.query.hr

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

  const size = hr ? 2400 : 600

  const canvas = new Canvas(size, size)
  const ctx = canvas.getContext('2d')

  Napchart.init(ctx, chartDocument.chartData || {}, {
    responsive: false,
    interaction: false,
    labelTextSize: 3,
    tagsTextSize: 3,
    colorTagsSize: 3,
    // @ts-ignore
    createPath: () => new Path2D(),
  })

  res.contentType('image/png')
  res.send(await canvas.png)
}
