import BaseComponent from './BaseComponent'
import helpers from '../helpers'
import shapeHelpers from '../shape/shapeHelpers'

export default class Segment extends BaseComponent {
    constructor(props) {
        super(props)

        this.draw = props.draw

        this.element = props.element
        this.active = false

        this.segment = props.lowGroup.path()
        this.segment.stroke({ color: '#666666', width: 1 })
        this.segment.mousedown(this.down)

        this.innerPattern = props.lowGroup.path()
        this.innerPattern.mousedown(this.down)
    }

    updateElement = (newAttrs) => {
        // why not just use values from this.element instead of assigning to this.[prop]?
        // because we might want to animate this.start and this.end
        // e.g when creating or deleting an element

        this.start = this.element.start
        this.end = this.element.end

        this.render()
    }

    init = () => {
        // without animation:
        // this.start = this.element.start
        // this.end = this.element.end
        // this.render()

        // with animation:
        const middle = helpers.middlePoint(this.element.start, this.element.end)

        this.animate(200, 'easeOutCubic', (progress) => {
            this.start = middle - (progress * this.element.duration / 2)
            this.end = middle + (progress * this.element.duration / 2)
            this.render()
        }, () => {
            this.start = this.element.start
            this.end = this.element.end
            this.render()
        })

        return this
    }

    render = () => {
        const { segment, active } = this
        const { selected } = this.element
        const { start, end } = this

        // make pattern smaller, and check that it doesn't mess up when duration
        // is small
        const duration = helpers.duration(start, end)
        const startOfInnerPattern = duration > 10 ? helpers.limit(start + 5) : start
        const endOfInnerPattern = duration > 10 ? helpers.limit(end - 5) : end

        const pattern = active ? this.props.patterns[1] : this.props.patterns[0]
        const fill = active ? '#ded6c7' : '#fdf5e6'

        segment
            .plot(shapeHelpers.createSegment(this.props.shape, '', start, end, 90, 0))
            .fill(fill)

        this.innerPattern.plot(shapeHelpers.createSegment(this.props.shape, '', startOfInnerPattern, endOfInnerPattern, 85, 5))
            .fill(pattern)

    }

    down = (e) => {
        this.active = true

        const info = shapeHelpers.XYtoInfo(this.props.shape, this.getCoordinates(e))
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
        const info = shapeHelpers.XYtoInfo(this.props.shape, this.getCoordinates(e))

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
        return Math.round(input / 10) * 10
    }
}