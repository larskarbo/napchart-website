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
        const canvas = ReactDOM.findDOMNode(this.canvas)
        this.canvas = canvas
        // const draw = window.SVG(container)
        const ctx = canvas.getContext('2d')
        canvas.width = container.offsetWidth * 2
        canvas.height = container.offsetHeight * 2
        console.log(container.getClientRects())
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.fillStyle = 'red'

        this.ctx = ctx
        var p = new Path2D("m 75.8672,80.4954 c -0.6572,-0.0938 -2.252,-0.4688 -2.627,-0.375 -1.0313,0.1875 0.375,1.501 -0.1875,1.876 -0.4688,0.1875 -1.0313,-0.0938 -1.501,0.0938 -0.1875,0.0938 0.0938,0.4688 -0.0938,0.6572 -0.9375,0.75 -2.4385,0.8438 -3.377,1.6875 -1.125,1.0322 2.0635,3.6582 0.6572,4.6904 -3.2832,2.3447 -1.2197,-1.5947 -3.377,1.501 -0.2813,0.375 0.8438,0.4688 1.0313,0.9375 0.1875,0.376 -0.9375,0.2822 -0.9375,0.6572 0,0.1875 0.9375,1.4072 0.5625,1.876 -1.0313,1.0313 -2.5322,-0.5635 -3.4707,-0.5635 -1.4063,0 1.3135,1.3135 -1.0313,0.6572 -0.6572,-0.1875 -1.501,-1.2197 -1.7822,-1.7822 -0.1875,-0.1875 -0.376,-0.751 -0.4697,-0.5625 -0.375,0.5625 -0.2813,1.2188 -0.6563,1.6875 -1.2188,1.5947 -2.9082,0 -4.3145,0.4697 -0.1875,0.0938 0.1875,0.4688 0,0.6563 -0.8447,0.4688 -2.5332,0.375 -3.377,0 0,0 0,-0.0938 0.0938,-0.0938 0.4688,-0.4688 1.0313,-0.9375 1.2197,-1.4072 3.2822,0.1875 -0.4697,-2.0635 -1.4072,-2.626 -0.6563,-0.375 0.375,-1.5947 0.1875,-2.0635 -0.1875,-0.4697 -1.6885,0.8438 -1.3135,-0.376 0.2813,-0.8438 2.0635,-1.5938 1.4072,-2.1572 -0.4688,-0.375 -2.627,-0.1875 -2.4385,-1.3125 0.1875,-1.501 2.5322,-1.126 2.7197,-3.002 -0.0938,0 -0.0938,0 -0.1875,0 0.5625,0.0938 1.126,0.1875 1.7822,0.2813 0.75,0.0938 1.501,0.6563 2.251,0.75 0.751,0.0938 1.501,-0.4688 2.252,-0.375 0.4688,0.0938 0.75,0.751 1.2188,0.751 0.1875,0.0938 0.0938,-0.4697 0.2813,-0.5635 0.4697,-0.4688 1.2197,-0.6563 1.6885,-1.2188 0.376,-0.2822 0.0938,-0.9385 0.376,-1.2197 1.7813,-1.4072 3.6582,0.375 5.3457,-0.375 0.5635,-0.2813 0.6572,-1.126 1.2197,-1.3135 0.0938,-0.0938 3.1895,0.375 3.2832,0.2813 0.2813,-0.0938 -0.2813,-0.4688 -0.375,-0.75 -0.2813,-1.501 0.8438,-1.876 2.251,-1.876 0.3752,0 1.1262,2.9072 3.0959,4.502 l 0,0 z");
        ctx.stroke(p);
        ctx.fill(p);
        // this.draw = draw
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

        // draw.rect(container.offsetWidth, container.offsetHeight)
        //     .fill('transparent')
        //     .click(this.onClickBG)

        // const c1 = new Rail({
        //     draw,
        //     shape
        // })



        this.elements = []
        this.props.elements.forEach(e => {
            this.addElement(e)
        })


        // elements.forEach(e => {
        //     e.init()
        // })

        // draw.click(this.onClickBG)

        requestAnimationFrame(this.animFrame)

        canvas.addEventListener('mousedown', (e) => {
            const hit = this.elements.find(el => {
                // e.render()
                const xy = this.getCoordinates(e)
                return this.ctx.isPointInPath(el.path, xy.x, xy.y)
            })
            if (hit) {
                hit.down(this.getCoordinates(e))
            }
            // console.log(hit)
        })
    }

    animFrame = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.elements.forEach(e => {
            e.render()
        })

        requestAnimationFrame(this.animFrame)

    }

    addElement = (element) => {
        this.elements.push(new Element({
            ctx: this.ctx,
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

    getCoordinates = (e) => {
        const boundingRect = this.canvas.getBoundingClientRect()
        return {
            x: (e.clientX - boundingRect.left),
            y: (e.clientY - boundingRect.top)
        }
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
            >
                <canvas
                    // width={}
                    ref={(c) => this.canvas = c}
                // onClick={this.onClickBG}
                >
                </canvas>
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