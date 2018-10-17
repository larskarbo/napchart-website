import calculateShape from './calculateShape'
import shapes from './shapes'

const progr = (value, from, to, progress) => {
    const duration = to - from;
    const out = from + duration * progress
    if (typeof out === 'undefined' || out == null || isNaN(out)) {
        console.log(value, from, to, progress)
        throw `Stopping because ${value} was suddenly ${out}`
    }
    return out
}

const getShapeDiff = (from, to, progress) => {
    return {
        ...from,
        startAngle: progr('startAngle', from.startAngle, to.startAngle, progress),
        gravity: progr('gravity', from.gravity, to.gravity, progress),
        elements: from.elements.map((element, i) => {
            return {
                ...element,
                // bend: progr(element.bend, to.elements[i].bend, progress),
                minutes: progr('minutes', element.minutes, to.elements[i].minutes, progress),
                angleLength: progr('angleLength', element.angleLength, to.elements[i].angleLength, progress),
            }
        })
    }
}

export default class View {
    constructor(props) {
        // super(props)
        this.props = props
        this.animationActive = false
        this.height = props.height
        this.width = props.width

        this.state = {
            shape: 'circleWithHoleRotated'
        }
        
        // this.animateToWave()
    }

    animateToWave = () => {
        this.animationActive = true
        this.animationStart = performance.now()
        this.from = shapes['line']
        this.to = shapes['circle']
    }

    getShape = (shape) => {
        // if (this.animationActive) {
        //     // 
        //     const timeStamp = performance.now()
        //     const animationProgress = Math.max(Math.min(((timeStamp - this.animationStart)) / 3000, 1), 0)
        //     const withEasing = helpers.easingEffects['easeInOutCubic'](animationProgress)

        //     if (animationProgress < 1) {
        //         const shapeSource = getShapeDiff(this.from, this.to, withEasing)
        //         // 
        //         return JSON.parse(JSON.stringify(calculateShape(shapeSource)))
        //     } else {
        //         // this.animationActive = false
        //         return JSON.parse(JSON.stringify(calculateShape(shapes['circle'])))
        //     }
        // }
        return JSON.parse(JSON.stringify(calculateShape(shapes[shape], this.width, this.height)))
    }

    getShapeAnimated = (progress, from, to) => {
        if (typeof shapes[from] == 'undefined' || typeof shapes[to] == 'undefined') {
            throw "couldn't find shape"
        }
        console.log('shapes[from], shapes[to]: ', shapes[from], shapes[to], progress);
        const newSHape = getShapeDiff(shapes[from], shapes[to], progress)
        console.log('newSHape: ', newSHape);

        return JSON.parse(JSON.stringify(calculateShape(newSHape, this.width, this.height)))
    }
}