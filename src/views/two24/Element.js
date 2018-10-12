import BaseComponent from './BaseComponent'
import rough from 'roughjs'

export default class Element extends BaseComponent {
    constructor(props) {
        super(props)

        this.ctx = props.ctx

        const { start, end, svg } = props

        const path = this.ctx.path()
        this.createSegment(path, start, end, 90, 0)
        path.drawAnimated({
            duration: 500
        })
        path.fill('yellow')
        path.stroke({ color: 'gray', width: 1, linecap: 'round', linejoin: 'round' })

        path.mousedown(function () {
            this.fill('red')
        })

        path.mouseup(function () {
            this.fill('green')
        })
    }
}
