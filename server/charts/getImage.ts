import { pool } from '../database'
import { asyncIncrementVisit } from './utils/asyncIncrementVisit'
import { ChartDocument } from '../../src/components/Editor/types'
import { ChartCreationReturn } from './createChart'
import { WEB_BASE } from '../utils/webBase'
import { getProperLink } from '../utils/getProperLink'
import { Canvas, loadImage, Path2D } from 'skia-canvas'
import Napchart from '../../napchart-canvas/lib/index'

export const getImage = async function (req, res) {
  const chartid = req.params.chartid
  console.log('chartid: ', chartid)

  pool.query('SELECT * FROM charts WHERE chartid = $1 AND deleted = false', [chartid], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length == 0) {
      return res.status(404).send({
        message: 'not found',
      })
    }

    const chart = results.rows[0]

    asyncIncrementVisit(chartid)

    const chartDocument: ChartDocument = {
      chartData: chart.chart_data,
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

    const canvas = new Canvas(600, 600)
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    // let path1 = new Path2D();
    // path1.arc(100, 75, 50, 0, 0.3 * Math.PI)
    // path1.arc(100, 75, 50, 0.3 * Math.PI, 0.6 * Math.PI)
    // ctx.fill(path1)

    Napchart.init(ctx, chartDocument.chartData || {}, {
      responsive: false,
      interaction: false,
      labelTextSize: 3,
      tagsTextSize: 3,
      colorTagsSize: 3,
      createPath: () => new Path2D()
    })

    res.contentType('image/png')
    res.send(canvas.toBuffer('png'))
  })
}
