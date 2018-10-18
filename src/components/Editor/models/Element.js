import helpers from '../../../renderers/svg24/helpers'

class Element {
    constructor(data) {
        this.start = data.start
        this.end = data.end
        this.title = data.title
        this.color = data.color
        this.selected = false

        this.duration = helpers.limit(this.end - this.start)

        this.id = Math.round(Math.random() * 10000)

    }

    changeAttrs = (data) => {
        // this doesn't feel right (we should check the props or something)
        for (const prop in data) {
            this[prop] = data[prop]
        }
        this.duration = helpers.duration(this.start, this.end)

        this.start = helpers.limit(this.start)
        this.end = helpers.limit(this.end)
    }

    select() {
        this.selected = true
    }
}

export default Element