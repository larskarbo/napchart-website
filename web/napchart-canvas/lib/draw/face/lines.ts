import { NapchartType } from '../../types'

export const drawLines = (chart: NapchartType) => {
  const { ctx } = chart
  const helpers = chart.helpers
  const config = chart.config
  const lanes = chart.shape.lanes

  if (!config.drawFace) {
    return
  }

  ctx.lineWidth = config.face.stroke
  ctx.save()

  // every hour weak

  ctx.strokeStyle = config.face.weakStrokeColor
  ctx.setLineDash([2, 4])

  ctx.beginPath()

  for (let i = 0; i <= 24; i++) {
    if (i == 24 && chart.shapeIsContinous) {
      continue
    }
    const s = helpers.minutesToXY(chart, i * 60, lanes[0].start)
    const e = helpers.minutesToXY(chart, i * 60, lanes[lanes.length - 1].end)
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(e.x, e.y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  ctx.restore()
}
