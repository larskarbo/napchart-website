import { NapchartType } from '../../types'

export function drawNumbers(chart: NapchartType): void {
  const { ctx } = chart
  const { helpers, config } = chart

  if (!config.drawFace) {
    return
  }

  ctx.save()
  ctx.font = helpers.fontSize(chart, config.fontSize.big)
  ctx.fillStyle = config.face.numbers.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const endLane = chart.shape.lanes[chart.shape.lanes.length - 1]

  for (let i = 0; i <= 24; i += 4) {
    if (i === 24 && chart.shapeIsContinous) {
      return
    }
    const p = helpers.minutesToXY(chart, i * 60, endLane.end + config.face.numbers.distance)

    let text = i + ""

    if (config.ampm) {
      if (i === 0) {
        text = 'midnight'
      } else if (i < 12) {
        text = `${text} am`
      } else if (i === 12) {
        text = 'noon'
      } else if (i > 12) {
        text = `${i - 12} pm`
      }
    }

    ctx.fillText(text.toString(), p.x, p.y)
  }

  ctx.restore()
}
