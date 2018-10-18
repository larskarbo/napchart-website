import BaseComponent from './BaseComponent'
import shapeHelpers from '../shape/shapeHelpers'

// in this component we use the native animation capabilities
// of svg.js

export default class Circles extends BaseComponent {
    constructor(props) {
        super(props)

        this.draw = props.draw

        const outerC = this.draw.path().plot(shapeHelpers.createCurve(props.shape, '', 0, 1440, 90))
        outerC.drawAnimated({
            duration: 500
        })
        outerC.fill('none')
        outerC.stroke({ color: 'gray', width: 1, linecap: 'round', linejoin: 'round' })


        const innerC = this.draw.path()
        innerC.plot(shapeHelpers.createCurve(props.shape, '', 0, 1440, 0)).drawAnimated({
            duration: 500,
            delay: 200
        })
        innerC.fill('none')
        innerC.stroke({ color: 'gray', width: 1, linecap: 'round', linejoin: 'round' })
    }
}
