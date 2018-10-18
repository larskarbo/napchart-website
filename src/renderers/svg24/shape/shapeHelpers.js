// TODO refactor shape system

import helpers from '../helpers'


const shapeHelpers = {
    createCurve: (shp, path, start, end, radius, anticlockwise) => {
        if (typeof anticlockwise === 'undefined') {
            const anticlockwise = false
        }

        const shape = helpers.clone(shp)
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
            throw new Error(`Couldn\'t find shape element for ${start} and ${end}`)
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

            path = helpers.arcToPath(path, circleCenter.x, circleCenter.y, ourRadius, startAngleThis, endAngleThis, reverse ? !anticlockwise : anticlockwise)
        })


        return path
    },

    createSegment: (shape, path, start, end, outer, inner) => {

        let p = path
        p = shapeHelpers.createCurve(shape, p, start, end, outer, false)
        p = shapeHelpers.createCurve(shape, p, end, start, inner, true)
        p += ' Z'

        return p
    },

    minutesToXY: (shape, minutes, radius, toCenter) => {
        if (typeof toCenter == 'undefined') {
            toCenter = true
        }


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
    },

    XYtoInfo: (shape, coordinates) => {
        // will gather two things: minutes and distance
        var minutes, distance

        const { x, y } = coordinates

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

        if (!shapeElement) {
            return false
        }

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

        distance = helpers.distance(x, y, shapeElement.circleCenter) - shapeElement.circleRadius

        if (isNaN(minutes) || isNaN(distance)) {

            throw new 'ouch'()
        }

        return {
            minutes,
            distance,
        }
    }
}

export default shapeHelpers