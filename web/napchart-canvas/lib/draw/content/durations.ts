import { duration, middlePoint, minutesToReadable } from '../../helperFunctions'
import { minutesToXY } from '../../shape/shapeHelpers'
import { colorToHex } from '../canvasHelpers'
import { textHelper } from '../textHelper'

import { NapchartType } from '../../types'

export const drawDurations = (chart: NapchartType): void => {
  const ctx = chart.ctx
  const config = chart.config

  if (!config.text) return

  chart.data.elements.forEach((element) => {
    const lane = chart.shape.lanes[element.lane]

    ctx.save()
    const middleMinutes = middlePoint(element.start, element.end)

    const radius = (lane.start + lane.end) / 2
    const textPosition = minutesToXY(chart, middleMinutes, radius)
    const durationText = minutesToReadable(duration(element.start, element.end))

    textHelper.string(durationText, textPosition.x, textPosition.y, {
      size: config.fontSize.medium,
      color: 'white',
      background: colorToHex(chart, element.color),
      roundedCorners: true,
    })

    ctx.restore()
  })
}
