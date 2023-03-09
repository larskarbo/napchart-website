import { middlePoint, duration } from '../../helperFunctions'
import { minutesToXY } from '../../shape/shapeHelpers'
import { NapchartType } from '../../types'
import { colorToHex } from '../canvasHelpers'
import { textHelper } from '../textHelper'

export function drawLabels(chart: NapchartType): void {
  const { ctx } = chart
  const { config } = chart

  if (!config.text) return

  chart.data.elements.forEach((element) => {
    const { text, lane, start, end, color } = element

    if (text.length === 0) {
      return
    }

    const laneShape = chart.shape.lanes[lane]

    ctx.save()
    let middleMinutes = middlePoint(start, end)
    if (duration(start, end) < 90) {
      middleMinutes = Math.max(middleMinutes, start + 40)
    }

    let radius = laneShape.end + config.content.textDistance
    if (lane === 0) {
      radius = laneShape.start - config.content.textDistance
    }

    const textPosition = minutesToXY(chart, middleMinutes, radius)

    textHelper.string(text, textPosition.x, textPosition.y, {
      size: config.labelTextSize,
      color: 'white',
      background: colorToHex(chart, color),
    })

    ctx.restore()
  })
}
