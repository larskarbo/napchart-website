// TODO refactor shape system

/**
 *
 * function calculateShape
 *
 * This function takes a normal shape definition object
 * and calculates positions and sizes
 *
 * Returns a more detailed shape object that is later
 * assigned to chart.shape and used when drawing
 *
 */

import helpers from '../helpers'

export default function calculateShape(sh, width, height) {

  // clone

  const shape = Object.assign({}, sh)
  const padding = 20

  /**
   * Calculate information
   */

  shape.elements.forEach((element, i) => {
    let startPoint
    let startAngle
    let start

    const angleLength = element.angleLength || 1

    const angle = Math.asin(element.bend) * angleLength
    const totalAngle = Math.abs(angle * 2)

    if (i === 0) {
      // first element
      startAngle = shape.startAngle
      // || (totalAngle / -2)
      startPoint = {
        x: padding + shape.gravity * width,
        y: 200,
      }

      start = shape.startAt || 0
    } else {
      // all other elements
      startPoint = shape.elements[i - 1].endPoint
      startAngle = shape.elements[i - 1].endAngle
      start = shape.elements[i - 1].end
    }

    if (element.bend < 0) {
      startAngle += Math.PI
    }

    let endAngle = startAngle + totalAngle
    if (element.bend < 0) {
      endAngle = startAngle - totalAngle
    }

    const length = 200
    let circleRadius = length / element.bend



    let circleCenter
    circleCenter = {
      x: startPoint.x - Math.cos(Math.PI / 2 - startAngle) * circleRadius,
      y: startPoint.y + Math.sin(Math.PI / 2 - startAngle) * circleRadius,
    }
    let endPoint
    endPoint = {
      x: circleCenter.x + Math.cos(Math.PI / 2 - endAngle) * circleRadius,
      y: circleCenter.y - Math.sin(Math.PI / 2 - endAngle) * circleRadius,
    }

    const end = element.ghost ? start : start + element.minutes

    shape.elements[i] = {
      ...element,
      start,
      end: end,
      startPoint,
      endPoint,
      startAngle: helpers.limitAngle(startAngle),
      endAngle: helpers.limitAngle(endAngle),
      totalAngle,
      circleCenter,
      circleRadius,
    }
  })



  return shape
}