import React from 'react'
import ReactDOM from 'react-dom';
import Two from 'two.js'
import Snap from 'snapsvg-cjs';
import Sector from 'paths-js/sector'
// import SVG from 'svg.js'
import Circle from './Circle'
import Rail from './Rail'
import Element from './Element'
import View from './View';

export default class Chart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    shouldComponentUpdate(nextProps) {



        const { elements } = nextProps

        const newElements = elements.reduce((cumm, thisE) => {
            if (!this.props.elements.some(e => e.id === thisE.id)) {
                return [...cumm, thisE]
            }
            return cumm
        }, [])

        const elementsThatShouldBeDeleted = this.props.elements.reduce((cumm, thisE) => {
            if (!elements.some(e => e.id === thisE.id)) {
                return [...cumm, thisE.id]
            }
            return cumm
        }, [])

        const changedElements = elements.filter(thisE => {
            const corresponding = this.props.elements.find(e => e.id === thisE.id)
            if (typeof corresponding != 'undefined') {
                if (!areEqualShallow(corresponding, thisE)) {
                    return true
                }
            }
        })

        newElements.forEach((e) => {
            this.addElement(e)
        })

        elementsThatShouldBeDeleted.forEach((id) => {
            this.deleteElement(id)
        })

        changedElements.forEach((e) => {
            this.changeElement(e)
        })

        return false
    }

    componentDidMount() {

        const container = ReactDOM.findDOMNode(this.container)
        const draw = window.SVG(container)
        this.draw = draw
        // var rect = draw.rect(100, 100).attr({ fill: '#f06' })

        // rect.mouseover(function () {
        //     this.fill({ color: '#0f5' })
        // })


        const shape = new View({
            width: container.offsetWidth,
            height: container.offsetHeight
        }).getShape()
        this.shape = shape

        // for (let i = 0; i < 48; i++) {
        //     const c1 = new Circle({
        //         draw,
        //         shape,
        //         minutes: i * 30,
        //         delay: i* 20
        //     })
        // }

        draw.rect(container.offsetWidth, container.offsetHeight)
            .fill('transparent')
            .click(this.onClickBG)

        const c1 = new Rail({
            draw,
            shape
        })



        this.elements = []
        this.props.elements.forEach(e => {
            this.addElement(e)
        })

        // elements.forEach(e => {
        //     e.init()
        // })

        // draw.click(this.onClickBG)
    }

    addElement = (element) => {
        this.elements.push(new Element({
            draw: this.draw,
            shape: this.shape,
            data: {
                ...element
            },
            changeElement: this.props.changeElement,
            selectElement: this.props.selectElement,
            deselectElement: this.props.deselectElement,
        }).init())
    }

    deleteElement = (id) => {
        const element = this.elements.find(e => id == e.id)

        element.destroy()
        this.elements = this.elements.filter(e => e.id != id)
    }

    changeElement = (elementData) => {
        const elementInstance = this.elements.find(e => elementData.id == e.id)

        elementInstance.updateData(elementData)
        elementInstance.render()
    }

    componentDidUpdate() {

    }

    onClickBG = () => {
        console.log('asdfs')
        this.props.deselect()
    }

    render() {
        var blurClass = ''
        if (this.props.loading) {
            blurClass = 'blur'
        }
        return (
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                    // background: 'red'
                }}
                ref={(c) => this.container = c}
                // onClick={this.onClickBG}
            >
            </div>
        )
    }
}

function areEqualShallow(a, b) {
    for (var key in a) {
        if (!(key in b) || a[key] !== b[key]) {
            return false;
        }
    }
    for (var key in b) {
        if (!(key in a) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}