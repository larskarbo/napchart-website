import { NapchartType } from '../types'

export function hitDetect(
  chart: NapchartType,
  coordinates: { x: number; y: number },
): { elementId?: number; type?: string; distance?: number; positionInElement?: number } {
  const canvas = chart.canvas
  const data = chart.data
  const helpers = chart.helpers

  // will return:
  // element
  // type (start, end, or middle)
  // distance

  let hit: { elementId?: number; type?: string; distance?: number; positionInElement?: number } = {}

  // hit detection of handles:

  let distance: number

  data.elements.forEach(function (element) {
    const lane = chart.shape.lanes[element.lane]

    // if element is not selected, continue
    if (!chart.isSelected(element.id)) {
      return
    }
    ;['start', 'end'].forEach(function (startOrEnd) {
      const point = helpers.minutesToXY(chart, element[startOrEnd], lane.end)

      distance = helpers.distance(point.x, point.y, coordinates)
      if (distance < chart.config.handlesClickDistance) {
        if (typeof hit.distance === 'undefined' || distance < hit.distance) {
          hit = {
            elementId: element.id,
            type: startOrEnd,
            distance: distance,
          }
        }
      }
    })
  })

  // if no handle is hit, check for middle hit

  if (Object.keys(hit).length == 0) {
    const info = helpers.XYtoInfo(chart, coordinates.x, coordinates.y)
    if (!info) {
      return {}
    }
    // loop through elements
    data.elements.forEach(function (element) {
      const lane = chart.shape.lanes[element.lane]

      // check if point is inside element horizontally
      if (helpers.isInside(info.minutes, element.start, element.end)) {
        // check if point is inside element vertically
        const innerRadius = lane.start
        const outerRadius = lane.end
        if (info.distance > innerRadius && info.distance < outerRadius) {
          hit = {
            elementId: element.id,
            type: 'middle',
            positionInElement: info.minutes - element.start,
          }
        }
      }
    })
  }

  return hit
}
