import BaseComponent from './BaseComponent'
import helpers from './helpers'
import rough from 'roughjs'

export default class Element extends BaseComponent {
    constructor(props) {
        super(props)

        this.draw = props.draw

        this.updateData(props.data)

        /* State: */
        this.active = false

        this.segment = this.draw.path()

        this.segment.mousedown(this.down)
        this.segment.mouseup(this.up)

        this.handleStart = this.draw.circle().radius(50).addClass('handle')
        this.handleEnd = this.handleStart.clone()

        this.handleStart.mousedown(this.hsDown)
        this.handleEnd.mousedown(this.heDown)

        this.segment.stroke({ color: '#666666', width: 1})
    }

    init = () => {
        
        this.render()

        return this
    }

    updateData = (data) => {
        
        this.id = data.id
        this.start = data.start
        this.end = data.end
        this.duration = helpers.duration(this.start, this.end)
        this.selected = data.selected || false
    }

    destroy(){
        const { segment } = this

        const startWas = this.start
        const endWas = this.end

        this.animate(200, 'easeOutCubic',  (progress) => {
            
            this.end = endWas - (progress * this.duration / 2)
            this.start = startWas + (progress * this.duration / 2)
            this.render()

        }, () => {
            this.segment.remove()
        })
        // segment.animate(200).attr({ fill: '#d9f442' })
    }

    

    render = () => {
        const { segment, handleStart, handleEnd } = this
        const { start, end } = this

        const fill = this.selected ? "#d9f442" : '#ea552c'

        
        segment
            .plot(this.createSegment('', start, end, 90, 0))
            .fill(fill)

        if (this.selected) {
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

        // this.path.animate(80).fill("#d9f442").stroke({ color: '#ce261a', width: 3 })
        // this.render()


        const info = this.XYtoInfo(this.getCoordinates(e))
        this.positionInElement = info.minutes - this.start

        this.props.selectElement(this.id)

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
                this.props.changeElement(this.id, {
                    start: newStart,
                    end: helpers.limit(newStart + this.duration)
                })
            }
        }

        else if (this.active == 'start') {
            const newStart = this.snap(helpers.limit(info.minutes))
            if (newStart != this.start) {
                this.props.changeElement(this.id, {
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