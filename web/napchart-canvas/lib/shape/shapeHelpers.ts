import {
  angleBetweenTwoPoints,
  isInside,
  distanceFromPointToLine,
  distanceFromPointToLineSegment,
  getProgressBetweenTwoValues,
  isInsideAngle,
  distance as calcDistance,
  duration as calcDuration,
  clone,
  getPositionBetweenTwoValues,
  limit,
} from '../helperFunctions'
import { NapchartType } from '../types'

export const XYtoInfo = function (chart, x, y) {
  // will gather three things: minutes and distance and lane from basepoint
  var minutes, distance
  var shape = chart.shape

  // which element is the right sector

  var shapeElement = shape.elements.find((element) => {
    if (element.type === 'arc') {
      var angle = angleBetweenTwoPoints(x, y, element.startPoint)
      if (angle >= element.startAngle && angle <= element.endAngle) {
        return true
      }
    } else if (element.type === 'line') {
      var angle1 = angleBetweenTwoPoints(x, y, element.startPoint)
      var angle2 = angleBetweenTwoPoints(x, y, element.endPoint)

      if (
        isInsideAngle(angle1, element.startAngle, element.startAngle + Math.PI / 2) &&
        isInsideAngle(angle2, element.startAngle - Math.PI / 2, element.startAngle)
      ) {
        return true
      }
    }
    return false
  })

  if (typeof shapeElement === 'undefined') {
    // probably line shape and out of bounds
    // make an extra effort and find the *closest* shapeElement

    shapeElement = shape.elements.reduce(
      (bestElement, thisElement) => {
        if (thisElement.type === 'line') {
          var distance = distanceFromPointToLineSegment(x, y, thisElement.startPoint, thisElement.endPoint)
          if (distance < bestElement.distance) {
            return {
              ...thisElement,
              distance,
            }
          }
        }
        return bestElement
      },
      { distance: 1440, initial: true },
    )
  }

  // calculate the relative position inside the element
  // and find minutes
  var positionInShapeElement

  if (shapeElement.type === 'arc') {
    var angle = angleBetweenTwoPoints(x, y, shapeElement.startPoint)
    positionInShapeElement = getProgressBetweenTwoValues(angle, shapeElement.startAngle, shapeElement.endAngle)
  } else if (shapeElement.type === 'line') {
    var a = distanceFromPointToLineSegment(x, y, shapeElement.startPoint, shapeElement.endPoint)
    var b = calcDistance(x, y, shapeElement.startPoint)
    var length = Math.sqrt(b * b - a * a)
    positionInShapeElement = length / shapeElement.length
    if (isNaN(positionInShapeElement)) {
      // this happens sometimes because 0/0 == NaN
      positionInShapeElement = 0
    }
  }
  var minutes = calcDuration(shapeElement.start, shapeElement.end) * positionInShapeElement + shapeElement.start
  minutes = Math.min(minutes, 1440) // so you cant drag line elements to 1450 1460 ...

  // 
  if (shapeElement.type === 'arc') {
    distance = calcDistance(x, y, shapeElement.startPoint)
  } else if (shapeElement.type === 'line') {
    // TODO: this is a hotfix
    if (chart.data.shape == 'line') {
      distance = distanceFromPointToLine(y, shapeElement.startPoint.y)
    } else {
      distance = distanceFromPointToLineSegment(x, y, shapeElement.startPoint, shapeElement.endPoint)
    }
  }

  if (isNaN(minutes) || isNaN(distance)) {
    throw new Error('ouch')
  }

  var lanes = chart.shape.lanes
  var lane = lanes.findIndex((lane) => distance > lane.start && distance < lane.end)
  return {
    minutes,
    distance,
    lane,
  }
}

export const minutesToXY = function (chart, minutes, radius) {
  var ctx = chart.ctx
  var shape = chart.shape

      // @ts-ignore
  var minutes = limit(minutes)
  // Find out which shapeElement we find our point in
  var shapeElement = shape.elements.find(function (element) {
    return isInside(minutes, element.start, element.end)
  })

  if (typeof shapeElement === 'undefined') {
    
    throw new Error('shapeElement==undefined')
  }
  // Decimal used to calculate where the point is inside the shape
  var positionInShape = getProgressBetweenTwoValues(minutes, shapeElement.start, shapeElement.end)

  if (shapeElement.type === 'line') {
    var basePoint = {
      x: shapeElement.startPoint.x + Math.cos(shapeElement.startAngle) * positionInShape * shapeElement.length,
      y: shapeElement.startPoint.y + Math.sin(shapeElement.startAngle) * positionInShape * shapeElement.length,
    }
    var point = {
      x: basePoint.x + Math.cos(shapeElement.startAngle - Math.PI / 2) * radius,
      y: basePoint.y + Math.sin(shapeElement.startAngle - Math.PI / 2) * radius,
    }
  } else if (shapeElement.type === 'arc') {
    var centerOfArc = shapeElement.startPoint
    var angle = positionInShape * shapeElement.radians
    var point = {
      x: centerOfArc.x + Math.cos(shapeElement.startAngle + angle - Math.PI / 2) * radius,
      y: centerOfArc.y + Math.sin(shapeElement.startAngle + angle - Math.PI / 2) * radius,
    }
  }

  return point
}

export const createCurve = function (chart: NapchartType, path: Path2D | CanvasRenderingContext2D, start, end, radius, anticlockwise=false, callback?) {

  // the reason for this silly function inside function: callback see at the end
  function createCurveInner(start, end) {
    
    var shape = clone(chart.shape)
    if (anticlockwise) {
      shape.elements.reverse()
    }
    start = limit(start)
    end = limit(end)

    // find out which shapeElement has the start and end
    var startElementIndex, endElementIndex
    shape.elements.forEach(function (element, i) {
      if (isInside(start, element.start, element.end)) {
        startElementIndex = i
      }
      if (isInside(end, element.start, element.end)) {
        endElementIndex = i
      }
    })

    var shapeElements = []
    // create iterable task array
    var taskArray = []
    var skipEndCheck = false
    var defaultTask
    if (anticlockwise) {
      defaultTask = {
        start: 1,
        end: 0,
      }
    } else {
      defaultTask = {
        start: 0,
        end: 1,
      }
    }

    if (typeof startElementIndex === 'undefined' || typeof endElementIndex === 'undefined') {
      
      throw 'error: something is not right here'
    }

    for (var i = startElementIndex; i < shape.elements.length; i++) {
      var task = {
        shapeElement: shape.elements[i],
        start: defaultTask.start,
        end: defaultTask.end,
      }

      if (i == startElementIndex) {
        task.start = getPositionBetweenTwoValues(start, shape.elements[i].start, shape.elements[i].end)
      }
      if (i == endElementIndex) {
        task.end = getPositionBetweenTwoValues(end, shape.elements[i].start, shape.elements[i].end)
      }
      if (
        (i == startElementIndex && i == endElementIndex && task.end > task.start && anticlockwise) ||
        (task.end < task.start && !anticlockwise)
      ) {
        // make sure things are correct when end is less than start
        if (taskArray.length == 0) {
          // it is beginning
          task.end = defaultTask.end
          skipEndCheck = true
        } else {
          // it is end
          task.start = defaultTask.start
        }
      }

      taskArray.push(task)

      if (i == endElementIndex) {
        if (skipEndCheck) {
          skipEndCheck = false
          // let it run a round and add all shapes
        } else {
          // finished.. nothing more to do here!
          break
        }
      }

      // if we reached end of array without having found
      // the end point, it means that we have to go to
      // the beginning again
      // ex. when start:700 end:300
      if (i == shape.elements.length - 1) {
        i = -1
      }
    }
    
    taskArray.forEach(function (task, i) {
      var shapeElement = task.shapeElement
      if (shapeElement.type === 'arc') {
        var shapeStart = shapeElement.startAngle - Math.PI / 2
        var start = shapeStart + task.start * shapeElement.radians
        var end = shapeStart + task.end * shapeElement.radians
        path.arc(shapeElement.startPoint.x, shapeElement.startPoint.y, radius, start, end, anticlockwise)
      } else if (shapeElement.type === 'line') {
        var startPoint = minutesToXY(chart, shapeElement.start + shapeElement.minutes * task.start, radius)
        var endPoint = minutesToXY(chart, shapeElement.start + shapeElement.minutes * task.end, radius)
        path.lineTo(startPoint.x, startPoint.y)
        path.lineTo(endPoint.x, endPoint.y)
      }
    })
  }

  if (typeof callback === 'undefined') {
    createCurveInner(start, end)
  } else {
    // callback makes it possible for this function to do two operations
    // instead of one, thus be able to draw when shape is a straight line
    if (!chart.shapeIsContinous && start > end) {
      createCurveInner(start, 1440)
      callback()

      chart.ctx.beginPath() // this is a hotfix
      createCurveInner(0, end)
      callback()
    } else {
      createCurveInner(start, end)
      callback()
    }
  }
}

export const createSegment = function (chart: NapchartType, outer, inner, start, end, callback?) {
  const path = chart.createPath()

  function createSegment(start, end) {
    createCurve(chart, path, start, end, outer)
    createCurve(chart, path, end, start, inner, true)
  }

  
  if (typeof callback === 'undefined') {
    createSegment(start, end)
  } else {
    // callback makes it possible for this function to do two operations
    // instead of one, thus be able to draw when shape is a straight line
    if (!chart.shapeIsContinous && start > end) {
      createSegment(start, 1440)
      callback()
      
      createSegment(0, end)
      callback()
    } else {
      createSegment(start, end)
      callback()
    }
  }
  
  return path
}
