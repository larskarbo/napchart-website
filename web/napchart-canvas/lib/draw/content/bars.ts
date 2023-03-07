import { createSegment } from '../../shape/shapeHelpers'
import { colorMap } from '../canvasHelpers'
import { NapchartType, InteractionState } from '../../types'

export default function (chart: NapchartType, interactionState?: InteractionState) {
  const { ctx, config, data, shape } = chart

  // fill
  data.elements.forEach(function (element) {
    var lane = shape.lanes[element.lane]
    ctx.save()
    ctx.fillStyle = colorMap(chart, element.color)
    // if (chart.isActive(element.id, 'middle')) {
    //   ctx.globalAlpha = 0.9
    // }

    const path = createSegment(
      chart,
      lane.end - config.paddingLanes,
      lane.start + config.paddingLanes,
      element.start,
      element.end
    )

    ctx.fill(path)

    ctx.restore()
  })
}
