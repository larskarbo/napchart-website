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

import helpers from './helpers'

export default function calculateShape(sh, width, height) {
  // clone
  const shape = Object.assign({}, sh)
  

  /**
   * Calculate information
   */

  shape.elements.forEach((element, i) => {
    let startPoint
    let startAngle
    let start

    const angle = Math.asin(element.bend)
    const totalAngle = Math.abs(angle * 2)
    
    window.d
    if (i === 0) {
      // first element
      startAngle = totalAngle/-2
      startPoint = {
        x: window.innerWidth / 2 - 360,
        y: 400,
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

    // const correction = 1 / (element.bend * element.bend)

    // nice link to understand sin cos https://www.mathsisfun.com/geometry/unit-circle.html
    const specialNumber = Math.sqrt(1 - Math.pow(element.bend, 2))
    const cosine = Math.cos(angle)
    // 
    // 
    // 
    
    
    const halfMinutes = element.minutes / 4
    const lastAngle = (Math.PI / 2) - angle
    let circleRadius = halfMinutes / Math.sin(Math.abs(angle))
    // let circleRadius = (element.minutes) / totalAngle


    // let circleRadius = ((element.minutes) / totalAngle) * (1 / Math.abs(element.bend))
    // 
    // circleRadius = (element.minutes/2) * (cosine)
    // 
    // 
    // 
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
    // 
    // 

    shape.elements[i] = {
      ...element,
      start,
      end: start + element.minutes,
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