import { createSegment } from '../../shape/shapeHelpers'
import { colorToHex } from '../canvasHelpers'
import { NapchartType } from '../../types'

export default function drawBars(chart: NapchartType) {
  const { ctx, config, data, shape } = chart

  // fill
  data.elements.forEach(function (element) {
    var lane = shape.lanes[element.lane]
    ctx.save()
    ctx.fillStyle = colorToHex(chart, element.color)

    const path = createSegment(
      chart,
      lane.end - config.paddingLanes,
      lane.start + config.paddingLanes,
      element.start,
      element.end,
    )

    ctx.fill(path)

    ctx.restore()
  })
}
