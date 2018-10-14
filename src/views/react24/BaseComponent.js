import React from 'react'
import ReactDOM from 'react-dom';
import helpers from './helpers'
// import Larsact from '../../Larsact'
import moment from 'moment'
import Path from 'svg-path-generator'

export default class BaseComponent extends React.Component {
    constructor(props) {
        super(props)
        this.props = props

        // this.cr()
        // this.easing = 'easeInOutCubic'
    }

    animate = (opt, fun, cb) => {
        const initTime = performance.now()
        const duration = opt.duration || 400
        const easing = opt.easing || 'easeInOutCubic'
        const delay = opt.delay || 0

        const yabbadadoda = () => {
            const timeStamp = performance.now()
            const animationProgress = Math.max(Math.min((timeStamp - initTime - delay) / duration, 1), 0)
            const withEasing = helpers.easingEffects[easing](animationProgress)

            fun(withEasing)

            if (animationProgress < 1) {
                requestAnimationFrame(yabbadadoda)
            } else {
                if (cb) {
                    cb()
                }
            }
        }

        requestAnimationFrame(yabbadadoda)
    }

    createCurve = (p, start, end, radius, anticlockwise) => {
        if (typeof anticlockwise === 'undefined') {
            var anticlockwise = false
        }

        let path = p

        var shape = helpers.clone(this.props.shape)
        if (anticlockwise) {
            shape.elements.reverse()
        }


        // find out which shapeElement has the start and end
        var startElementIndex, endElementIndex
        shape.elements.forEach(function (element, i) {
            if (helpers.isInside(start, element.start, element.end)) {
                startElementIndex = i
            }
            if (helpers.isInside(end, element.start, element.end)) {
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
                end: 0
            }
        } else {
            defaultTask = {
                start: 0,
                end: 1
            }
        }

        if (typeof startElementIndex === 'undefined' || typeof endElementIndex === 'undefined') {
            
            throw 'error: something is not right here'
        }

        for (var i = startElementIndex; i < shape.elements.length; i++) {
            var task = {
                shapeElement: shape.elements[i],
                start: defaultTask.start,
                end: defaultTask.end
            }

            if (i == startElementIndex) {
                task.start = helpers.getPositionBetweenTwoValues(start, shape.elements[i].start, shape.elements[i].end)
            }
            if (i == endElementIndex) {
                task.end = helpers.getPositionBetweenTwoValues(end, shape.elements[i].start, shape.elements[i].end)
            }
            if (i == startElementIndex && i == endElementIndex && (task.end > task.start && anticlockwise) || (task.end < task.start && !anticlockwise)) {
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

            var { shapeElement } = task

            const reverse = shapeElement.bend < 0

            const { startPoint, endPoint, startAngle, endAngle, totalAngle, circleCenter, circleRadius } = shapeElement
            
            let startAngleThis = startAngle + (task.start * totalAngle)
            
            let endAngleThis
            if (shapeElement.bend < 0) {
                startAngleThis = startAngle - (task.start * totalAngle) - Math.PI / 2
                endAngleThis = startAngle - (task.end * totalAngle) - Math.PI / 2
            } else {
                startAngleThis = startAngle + (task.start * totalAngle) - Math.PI / 2
                endAngleThis = startAngle + (task.end * totalAngle) - Math.PI / 2
            }

            let ourRadius
            if (shapeElement.bend < 0) {
                ourRadius = circleRadius - radius
            } else {
                ourRadius = circleRadius + radius
            }


            function polarToCartesian(centerX, centerY, radius, angleInRadians) {
                var x = centerX + radius * Math.cos(angleInRadians);
                var y = centerY + radius * Math.sin(angleInRadians);
                return { x, y };
            }

            let startPointThis, endPointThis
            startPointThis = polarToCartesian(circleCenter.x, circleCenter.y, ourRadius, startAngleThis)
            endPointThis = polarToCartesian(circleCenter.x, circleCenter.y, ourRadius, endAngleThis)

            if (path.length === 0) {
                path += ` M ${startPointThis.x} ${startPointThis.y}`
            } else {
                path += ` L ${startPointThis.x} ${startPointThis.y}`
            }

            path += ` A ${ourRadius} ${ourRadius} 0 0 ${(reverse ? !anticlockwise : anticlockwise) ? 0 : 1} ${endPointThis.x} ${endPointThis.y}`

        })
        return path
        // } else {
        //     // callback makes it possible for this function to do two operations
        //     // instead of one, thus be able to draw when shape is a straight line

        //     if (true && start > end) {

        //         createCurve(start, 1440)
        //         callback()

        //         createCurve(0, end)
        //         callback()
        //     } else {
        //         createCurve(start, end)
        //         callback()
        //     }
        // }
    }



    createSegment = (path, start, end, outer, inner) => {

        let p = path
        p = this.createCurve(p, start, end, outer, false)
        p = this.createCurve(p, end, start, inner, true)
        // path.Z()
        p += ' Z'

        return p
    }

    minutesToXY = (minutes, radius, toCenter) => {
        if (typeof toCenter == 'undefined') {
            toCenter = true
        }

        const { shape } = this.props

        if (typeof minutes !== 'number') {
            var minutes = helpers.minutesInDay(minutes)
        }
        // Find out which shapeElement we find our point in
        var shapeElement = shape.elements.find(function (element) {
            return helpers.isInside(minutes, element.start, element.end)
        })
        if (typeof shapeElement === 'undefined') {
            throw new 'shapeElement==undefined'()
        }

        // Decimal used to calculate where the point is inside the shape
        var positionInShape = helpers.getProgressBetweenTwoValues(minutes, shapeElement.start, shapeElement.end)

        var centerOfArc = shapeElement.circleCenter
        var angle = positionInShape * shapeElement.totalAngle
        const ourRadius = shapeElement.bend < 0 ? shapeElement.circleRadius - radius : shapeElement.circleRadius + radius//shapeElement.bend < 0 ? shapeElement.circleRadius - (radius - shapeElement.circleRadius) : radius
        const ourAngle = shapeElement.bend < 0 ? shapeElement.startAngle - angle : shapeElement.startAngle + angle;

        if (toCenter) {
            var point = {
                x: centerOfArc.x + Math.cos(ourAngle - Math.PI / 2) * ourRadius,
                y: centerOfArc.y + Math.sin(ourAngle - Math.PI / 2) * ourRadius
            }
        } else {
            var point = {
                x: centerOfArc.x + Math.cos(ourAngle - Math.PI / 2) * shapeElement.circleRadius,
                y: centerOfArc.y + Math.sin(ourAngle - Math.PI / 2) * ourRadius
            }
        }
        return point
    }

    XYtoInfo = (coordinates) => {
        // will gather three things: minutes and distance and lane from basepoint
        var minutes, distance

        const { x, y } = coordinates

        const { shape } = this.props
        // var shape = chart.shape



        // which element is the right sector

        var shapeElement = shape.elements.find((element, i) => {
            var angle = helpers.angleBetweenTwoPoints(coordinates.x, coordinates.y, element.circleCenter)

            if (element.bend > 0) {
                if (helpers.isInsideAngle(angle, element.startAngle, element.endAngle)) {
                    return true
                }
            } else {
                if (helpers.isInsideAngle(angle, element.endAngle, element.startAngle)) {
                    return true
                }
            }

            return false
        })
        // 
        if (!shapeElement) {

            return false
        }
        // if (typeof shapeElement === 'undefined') {
        //   // probably line shape and out of bounds
        //   // make an extra effort and find the *closest* shapeElement

        //   shapeElement = shape.elements.reduce((bestElement, thisElement) => {
        //     if (thisElement.type === 'line') {
        //       var distance = helpers.distanceFromPointToLineSegment(x, y, thisElement.startPoint, thisElement.endPoint)
        //       if (distance < bestElement.distance) {
        //         return {
        //           ...thisElement,
        //           distance
        //         }
        //       }
        //     }
        //     return bestElement
        //   }, { distance: 1440, initial: true })
        // }

        // calculate the relative position inside the element
        // and find minutes
        var positionInShapeElement

        var angle = helpers.angleBetweenTwoPoints(x, y, shapeElement.circleCenter)
        if (shapeElement.bend > 0) {
            positionInShapeElement = helpers.getProgressBetweenTwoAngles(angle, shapeElement.startAngle, shapeElement.endAngle)
        } else {
            positionInShapeElement = helpers.getProgressBetweenTwoAngles(angle, shapeElement.endAngle, shapeElement.startAngle)
        }
        // 
        var minutes = helpers.duration(shapeElement.start, shapeElement.end) * positionInShapeElement + shapeElement.start
        minutes -= 360
        minutes = Math.min(minutes, 1440) // so you cant drag line elements to 1450 1460 ...

        // 
        distance = helpers.distance(x, y, shapeElement.circleCenter) - shapeElement.circleRadius

        if (isNaN(minutes) || isNaN(distance)) {

            throw new 'ouch'()
        }

        // var lanes = chart.shape.lanes
        // var lane = lanes.findIndex(lane => (distance > lane.start && distance < lane.end))
        return {
            minutes,
            distance,
            // lane
        }
    }
}