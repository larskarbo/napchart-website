import BaseComponent from './BaseComponent'
import helpers from './helpers'

export default class Segment extends BaseComponent {
    constructor(props) {
        super(props)

        this.draw = props.draw

        this.element = props.element

        
        this.active = false
        this.start = this.element.start
        this.end = this.element.end

        this.segment = props.lowGroup.path()
        this.innerPattern = props.lowGroup.path()

        

        this.segment.mousedown(this.down)
        this.innerPattern.mousedown(this.down)
        this.segment.mouseup(this.up)

        this.handleStart = props.highGroup.circle().radius(10).addClass('handle')
        this.handleEnd = this.handleStart.clone()

        this.handleStart.mousedown(this.hsDown)
        this.handleEnd.mousedown(this.heDown)

        this.segment.stroke({ color: '#666666', width: 1})
    }

    updateElement = (newAttrs) => {
        this.start = this.element.start
        this.end = this.element.end
        
        this.render()
    }

    init = () => {
        this.render()

        return this
    }


    destroy(){
        const { segment } = this

        const startWas = this.element.start
        const endWas = this.element.end

        this.animate(200, 'easeOutCubic',  (progress) => {
            
            this.end = endWas - (progress * this.duration / 2)
            this.start = startWas + (progress * this.duration / 2)
            this.render()

        }, () => {
            this.segment.remove()
        })
    }

    

    render = () => {
        const { segment, handleStart, handleEnd } = this
        const { selected } = this.element
        const { start, end } = this
        

        
        const pattern = selected ? this.props.patterns[1] : this.props.patterns[0]
        const fill = selected ? '#ded6c7' : '#fdf5e6'

        segment
            .plot(this.createSegment('', start, end, 90, 0))
            .fill(fill)
        
        this.innerPattern.plot(this.createSegment('', helpers.limit(start + 5), helpers.limit(end - 5), 85, 5))
            .fill(pattern)

        if (selected) {
            const hsPos = this.minutesToXY(start, 90)
            handleStart
                .fill(fill)
                .move(hsPos.x, hsPos.y)
    
            const hePos = this.minutesToXY(end, 90)
            handleEnd
                .fill(fill)
                .move(hePos.x, hePos.y)
        } else {
            handleStart
                .fill('none')
            
            handleEnd
                .fill('none')
        }
    }

    down = (e) => {
        this.active = 'middle'

        const info = this.XYtoInfo(this.getCoordinates(e))
        this.positionInElement = info.minutes - this.element.start

        this.props.onClick(this.element.id)

        window.addEventListener('mouseup', this.up)
        window.addEventListener('mousemove', this.drag)
    }

    hsDown = (e) => {
        this.active = 'start'

        window.addEventListener('mouseup', this.up)
        window.addEventListener('mousemove', this.drag)
    }

    heDown = (e) => {
        this.active = 'end'

        window.addEventListener('mouseup', this.up)
        window.addEventListener('mousemove', this.drag)
    }

    up = () => {
        this.active = false

        // this.path.animate(80).fill("#ea552c").stroke({ color: '#666666', width: 1 })

        // this.props.deselectElement(this.id)

        window.removeEventListener('mousemove', this.drag)
        window.removeEventListener('mouseup', this.up)

    }

    drag = (e) => {
        const info = this.XYtoInfo(this.getCoordinates(e))

        if (this.active == 'middle') {
            const newStart = this.snap(helpers.limit(info.minutes - this.positionInElement))
            
            if (newStart != this.start) {
                this.props.onChangeElement(this.element.id, {
                    start: newStart,
                    end: helpers.limit(newStart + this.element.duration)
                })
            }
        }

        else if (this.active == 'start') {
            const newStart = this.snap(helpers.limit(info.minutes))
            if (newStart != this.start) {
                this.props.onChangeElement(this.element.id, {
                    start: newStart
                })
            }
        }
    }

    getCoordinates = (e) => {
        const boundingRect = this.props.draw.node.getBoundingClientRect()
        return {
            x: (e.clientX - boundingRect.left),
            y: (e.clientY - boundingRect.top)
        }
    }

    snap = (input) => {
        return Math.round(input / 15) * 15
    }
}

function getCoordinates(position, chart) {
    var boundingRect = chart.canvas.getBoundingClientRect()
    // use window.devicePixelRatio because if a retina screen, canvas has more pixels
    // than the getCoordinates
    var dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    return {
        x: (position.x - boundingRect.left) * dpr,
        y: (position.y - boundingRect.top) * dpr
    }
}