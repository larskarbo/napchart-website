import { createSegment } from "../../shape/shapeHelpers"
import { colorMap } from "../canvasHelpers"
import { chart, InteractionState } from '../../types';

export default function (chart: chart, interactionState?: InteractionState) {
  const {ctx, config, data, shape} = chart

  // fill
  data.elements.forEach(function (element) {
    var lane = shape.lanes[element.lane]
    ctx.save()
    ctx.fillStyle = colorMap(chart, element.color)
    // if (chart.isActive(element.id, 'middle')) {
    //   ctx.globalAlpha = 0.9
    // }

    createSegment(chart, lane.end - config.paddingLanes, lane.start + config.paddingLanes, element.start, element.end, function () {
      ctx.fill()
    })

    ctx.restore()
  })
}