import BaseComponent from './BaseComponent'

export default class Rail extends BaseComponent {
    constructor(props) {
        super(props)

        this.ctx = props.ctx

        const outerC = this.ctx.path()
        this.createCurve(outerC, 0, 1440, 90)
        outerC.drawAnimated({
            duration: 500
        })
        outerC.fill('none')
        outerC.stroke({ color: 'gray', width: 1, linecap: 'round', linejoin: 'round' })


        const innerC = this.ctx.path()
        this.createCurve(innerC, 0, 1440, 0)
        innerC.drawAnimated({
            duration: 500,
            delay: 200
        })
        innerC.fill('none')
        innerC.stroke({ color: 'gray', width: 1, linecap: 'round', linejoin: 'round' })
    }
}
