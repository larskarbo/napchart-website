import { limit } from '../../helperFunctions'
import { createSegment } from '../../shape/shapeHelpers'
import { NapchartType } from '../../types'
import { colorToHex } from '../canvasHelpers'

export function drawPen(chart: NapchartType): void {
  const { ctx } = chart
  const { config } = chart

  if (chart.isPen()) {
    const { minutes, lane: laneNum } = chart.mousePenLocation
    const lane = chart.shape.lanes[laneNum]

    ctx.save()
    ctx.fillStyle = colorToHex(chart, chart.config.defaultColor)
    ctx.globalAlpha = 0.5
    const start = limit(minutes - 1)
    const end = limit(minutes + 1)
    const path = createSegment(chart, lane.end - config.paddingLanes, lane.start + config.paddingLanes, start, end)

    ctx.fill(path)

    ctx.restore()
  }
}
