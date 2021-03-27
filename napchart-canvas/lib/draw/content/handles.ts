import { minutesToXY } from '../../shape/shapeHelpers'
import { chart, InteractionState } from '../../types'
import { circle, colorMap } from '../canvasHelpers'

export default function handles(chart: chart, interactionState?: InteractionState) {
  var ctx = chart.ctx
  var config = chart.config
  var data = chart.data

  var element = data.elements.find((e) => e.id == chart.selectedElement)
  if (typeof element === 'undefined') {
    return
  }
  var lane = chart.shape.lanes[element.lane]

  ctx.save()

  var arr = ['start', 'end']

  arr.forEach(function (startOrEnd) {
    var handlePosition = minutesToXY(chart, element[startOrEnd], lane.end - config.paddingLanes)

    ctx.globalAlpha = 0.5
    ctx.fillStyle = colorMap(chart, element.color)

    circle(chart, handlePosition, config.content.handles)
    ctx.fill()

    if (chart.isHover(element.id, startOrEnd) || chart.isActive(element.id, startOrEnd)) {
      ctx.globalAlpha = 0.2
      ctx.fillStyle = colorMap(chart, element.color)

      circle(chart, handlePosition, config.handlesClickDistance)
      ctx.fill()
    }
  })
  ctx.restore()
}
