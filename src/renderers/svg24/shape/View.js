// TODO refactor shape system

import calculateShape from './calculateShape'
import shapes from './shapes'

const progr = (from, to, progress) => {
    const duration = to - from;
    return from + duration * progress
}

const getShapeDiff = (from, to, progress) => {
    return {
        ...from,
        elements: from.elements.map((element, i) => {
            return {
                ...element,
                bend: progr(element.bend, to.elements[i].bend, progress)
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
            shape: 'circle'
        }
        
        // this.animateToWave()
    }

    animateToWave = () => {
        this.animationActive = true
        this.animationStart = performance.now()
        this.from = shapes['line']
        this.to = shapes['circle']
    }

    getShape = () => {
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
        return JSON.parse(JSON.stringify(calculateShape(shapes[this.state.shape], this.width, this.height)))
    }

    render = () => {
        const { chart, ctx, progress } = this
        const { start, duration, color } = this.state

        const animatedEnd = start + progress(duration)

        ctx.fillStyle = color
        ctx.globalAlpha = progress(1)
        // if (start > 960) {
        //     ctx.globalAlpha = progress(1) * 0.2
        // }
        this.createSegment(-10, -70, start, animatedEnd, function () {
            ctx.fill()
        })
    }
}