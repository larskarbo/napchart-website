import helpers from '../../../renderers/svg24/helpers'

const valid_operations = [
    'change_element',
    'select_element',
    'add_element'
]

class Operation {
    constructor(type, data) {
        if (!valid_operations.includes(type)) {
            throw new Error(type + 'is not a valid type')
        }

        this.type = type
        this.data = data

        // check validity in data
        for (const prop in data) {
            if (typeof data[prop] === 'undefined' || helpers.isNaN(data[prop])) {
                console.log(isNaN(data[prop]))
                throw new Error(prop + ' is ' + data[prop])
            }
        }
    }

    findEvent(id) {
        return this.events.find(e => e.id == id)
    }
}

export default Operation