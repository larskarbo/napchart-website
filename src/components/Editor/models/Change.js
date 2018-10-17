import helpers from '../../../renderers/two24/helpers'
import Event from './Event'

class Change {
    constructor(value) {
        this.value = value
        this.operations = []
    }

}

export default Change