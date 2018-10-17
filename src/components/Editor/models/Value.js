import helpers from '../../../renderers/two24/helpers'
import Element from './Element'

class Value {
    constructor(opt) {
        this.title = 'My napchart 1'
        this.description = ''
        this.elements = []

        this.onChange = opt.onChange
    }

    applyOperations(operations) {
        // 1. applies operations to value object
        // 2. calls onChange function with:
        //      * mutated value object
        //      * operations

        operations.forEach(operation => {
            
            switch (operation.type) {
                case 'change_element':
                    this.changeElement(operation.data.id, operation.data)
                    return
                case 'select_element':
                    this.selectElement(operation.data.id)
                    return
                default: 
                    throw new Error('Couldn\'t find anything to do with operation ' + operation.type)
            }
        })

        this.onChange(this, operations)
    }

    addElement(eventData) {
        this.elements.push(new Element(eventData))

        return this
    }

    changeElement(id, newAttrs) {
        
        this.elements = this.elements.map(e => {
            if (e.id == id) {
                e.changeAttrs(newAttrs)
            }
            return e
        })
    }

    selectElement(id) {
        this.findElement(id).select()

        return this
    }

    findElement(id) {
        return this.elements.find(e => e.id == id)
    }
}

export default Value