import { minutesToClock } from '../../helperFunctions'
import { minutesToXY } from '../../shape/shapeHelpers'

import { NapchartType } from '../../types'
import { textHelper } from '../textHelper'

export default function drawHandleTimes(chart: NapchartType) {
  const { ctx, helpers, config } = chart

  if (!config.text) return

  chart.data!.elements.forEach((element) => {
    const lane = chart.shape.lanes[element.lane]

    ctx.save()

    const arr: ('start' | 'end')[] = ['start', 'end']

    arr.forEach((startOrEnd) => {
      const settings = config.content.handleTimes

      let radius = lane.end + settings.distance
      if (element.lane === 0) {
        radius = lane.start - settings.distance
      }

      ctx.fillStyle = settings.color

      const position = minutesToXY(chart, element[startOrEnd], radius)
      textHelper.string(minutesToClock(chart, element[startOrEnd]), position.x, position.y, {
        size: config.fontSize.small,
        color: config.content.handleTimes.color,
      })
    })

    ctx.restore()
  })
}
