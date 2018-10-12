import helpers from './helpers'
// import Larsact from '../../Larsact'
import moment from 'moment'
import Path from 'svg-path-generator'

export default class BaseComponent {
    constructor(props) {
        this.initTime = performance.now()

        this.props = props

        this.helpers = helpers
        // animation defaults
        this.animation = false
        this.animationDuration = 10000
        this.easing = 'easeInOutCubic'
        this.animationDelay = props.animationDelay || 0


        this.animations = {
            creation: 0
        }


        this.children = []
        
        // this.cr()
    }

    createCurve = (path, start, end, radius, anticlockwise, sumpath, callback) => {
        if (typeof anticlockwise === 'undefined') {
            var anticlockwise = false
        }


        // the reason for this silly function inside function: callback see at the end
        const createCurve = (startMoment, endMoment) => {
            var shape = helpers.clone(this.props.shape)
            if (anticlockwise) {
                shape.elements.reverse()
            }

            let start, end;

            const zero = moment().startOf('day')
            if (typeof startMoment === 'number') {
                start = startMoment
            } else {
                start = startMoment.diff(zero, 'minutes')
            }

            if (typeof endMoment === 'number') {
                end = endMoment
            } else {
                end = endMoment.diff(zero, 'minutes')
            }

            console.log('start', start, 'end', end)

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
                console.log(start, end)
                console.log(shape.elements)
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
                console.log('task.start: ', task.start);
                console.log('task.end: ', task.end);
                let endAngleThis
                if (shapeElement.bend < 0) {
                    startAngleThis = startAngle - (task.start * totalAngle)
                    endAngleThis = startAngle - (task.end * totalAngle)
                } else {
                    startAngleThis = startAngle + (task.start * totalAngle)
                    endAngleThis = startAngle + (task.end * totalAngle)
                }

                let ourRadius
                if (shapeElement.bend < 0) {
                    ourRadius = circleRadius - radius
                } else {
                    ourRadius = circleRadius + radius
                }



                // straight down
                // ctx.arc(circleCenter.x, circleCenter.y - radius, shapeElement.circleRadius, startAngleThis, endAngleThis, reverse ? !anticlockwise : anticlockwise)

                // to center
                // ctx.arc(circleCenter.x, circleCenter.y, ourRadius, startAngleThis, endAngleThis, reverse ? !anticlockwise : anticlockwise)
                // graphic.arc(500, 200, 300, 0, Math.PI)

                

                console.log(startAngleThis % Math.PI * 2, endAngleThis % Math.PI * 2)
                
                helpers.arcToPath(path, circleCenter.x, circleCenter.y, ourRadius, startAngleThis, endAngleThis, reverse ? !anticlockwise : anticlockwise)
                // console.log('sumpath: ', sumpath.currentPath);
                console.log('🙌🙌🙌')
                // console.log('sumpath: ', sumpath.currentPath);
                // console.log(start, end)
                // const path = .moveTo(start[0], start[1]).ellipticalArc(start[0], start[1], 0, 0, 0, end[0], end[1]).end()
                // const path = `M ${start[0]} ${start[1]} A ${ourRadius} ${ourRadius} 0 0 0 ${end[0]} ${end[1]}`
                // console.log(path)
                // sumpath += path

            })
        }

        // if (typeof callback === 'undefined') {
        createCurve(start, end)

        return sumpath
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

    

    createSegment = (path, start, end,outer, inner) => {

        this.createCurve(path, start, end, outer, false)
        this.createCurve(path, end, start, inner, true)
        path.Z()
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
        // console.log(shapeElement)
        if (!shapeElement) {
            console.log('no shape')
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
        // console.log(positionInShapeElement)
        var minutes = helpers.duration(shapeElement.start, shapeElement.end) * positionInShapeElement + shapeElement.start
        minutes = Math.min(minutes, 1440) // so you cant drag line elements to 1450 1460 ...

        // 
        distance = helpers.distance(x, y, shapeElement.circleCenter) - shapeElement.circleRadius

        if (isNaN(minutes) || isNaN(distance)) {
            console.log(minutes, distance)
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