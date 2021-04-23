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
  var hr = req.query.hr;

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

    const size = hr ? 2400 : 600

    const canvas = new Canvas(size, size)
    const ctx = canvas.getContext('2d')

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
