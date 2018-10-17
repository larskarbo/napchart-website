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

        this.segment.stroke({ color: '#666666', width: 1})
    }

    updateElement = (newAttrs) => {
        // why not just use values from this.element instead of assigning to this?
        // because we might want to animate this.start and this.end
        // e.g when creating or deleting an element
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
        const { segment, active } = this
        const { selected } = this.element
        const { start, end } = this
        

        
        const pattern = active ? this.props.patterns[1] : this.props.patterns[0]
        const fill = active ? '#ded6c7' : '#fdf5e6'

        segment
            .plot(this.createSegment('', start, end, 90, 0))
            .fill(fill)
        
        this.innerPattern.plot(this.createSegment('', helpers.limit(start + 5), helpers.limit(end - 5), 85, 5))
            .fill(pattern)

    }

    down = (e) => {
        this.active = 'middle'

        const info = this.XYtoInfo(this.getCoordinates(e))
        this.positionInElement = info.minutes - this.element.start

        this.props.onClick(this.element.id)

        window.addEventListener('mouseup', this.up)
        window.addEventListener('mousemove', this.drag)
    }

    up = () => {
        this.active = false

        this.render()

        window.removeEventListener('mousemove', this.drag)
        window.removeEventListener('mouseup', this.up)
    }

    drag = (e) => {
        const info = this.XYtoInfo(this.getCoordinates(e))

        const newStart = this.snap(helpers.limit(info.minutes - this.positionInElement))
        
        if (newStart != this.start) {
            this.props.onChangeElement(this.element.id, {
                start: newStart,
                end: helpers.limit(newStart + this.element.duration)
            })
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