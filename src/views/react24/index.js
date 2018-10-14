import React from 'react'
import ReactDOM from 'react-dom';
import Two from 'two.js'
import Snap from 'snapsvg-cjs';
import Sector from 'paths-js/sector'
// import SVG from 'svg.js'
import Circle from './Circle'
import Rail from './Rail'
import Element from './Element'
import BaseComponent from './BaseComponent'
import View from './View';

export default class Chart extends BaseComponent {
    constructor(props) {
        super(props)

        this.view = new View({
            width: 835,
            height: 500
        })
        const shape = this.view.getShape('circle')


        this.state = {
            container: null,
            shape: shape
        }


    }

    // shouldComponentUpdate(nextProps) {



    //     const { elements } = nextProps

    //     const newElements = elements.reduce((cumm, thisE) => {
    //         if (!this.props.elements.some(e => e.id === thisE.id)) {
    //             return [...cumm, thisE]
    //         }
    //         return cumm
    //     }, [])

    //     const elementsThatShouldBeDeleted = this.props.elements.reduce((cumm, thisE) => {
    //         if (!elements.some(e => e.id === thisE.id)) {
    //             return [...cumm, thisE.id]
    //         }
    //         return cumm
    //     }, [])

    //     const changedElements = elements.filter(thisE => {
    //         const corresponding = this.props.elements.find(e => e.id === thisE.id)
    //         if (typeof corresponding != 'undefined') {
    //             if (!areEqualShallow(corresponding, thisE)) {
    //                 return true
    //             }
    //         }
    //     })

    //     newElements.forEach((e) => {
    //         // this.addElement(e)
    //     })

    //     elementsThatShouldBeDeleted.forEach((id) => {
    //         // this.deleteElement(id)
    //     })

    //     changedElements.forEach((e) => {
    //         // this.changeElement(e)
    //     })

    //     return true
    // }

    componentDidMount() {

        const container = ReactDOM.findDOMNode(this.container)

        // setTimeout(() => {

        //     this.animate({
        //         duration: 3000,
        //         easing: 'easeOutExpo'
        //     }, (progress) => {
        //         // console.log((Math.sin(progress * 50)) / 2)
        //         this.setState({
        //             shape: this.view.getShapeAnimated(progress, 'circle', 'circleWithHole')
        //         })
        //     }, () => {
        //         this.animate({
        //             duration: 500,
        //             easing: 'linear'
        //         }, (progress) => {
        //             // console.log((Math.sin(progress * 50)) / 2)
        //             this.setState({
        //                 shape: this.view.getShapeAnimated(progress, 'circleWithHoleReadyForRotation', 'circleWithHoleRotated')
        //             })
    
    
    
        //         }, () => {
        //             this.animate({
        //                 duration: 2000,
        //                 easing: 'linear'
        //             }, (progress) => {
        //                 // console.log((Math.sin(progress * 50)) / 2)
        //                 this.setState({
        //                     shape: this.view.getShapeAnimated(progress, 'circleWithHoleReadyForLine', 'line')
        //                 })
    
    
    
        //             }, () => {
        //                 this.setState({
        //                     shape: this.view.getShape('lineClean')
        //                 })
        //             })
        //         })
        //     })
        // }, 1000)
        // const draw = window.SVG(container)
        // this.draw = draw
        // var rect = draw.rect(100, 100).attr({ fill: '#f06' })

        // rect.mouseover(function () {
        //     this.fill({ color: '#0f5' })
        // })

        this.setState({

            width: container.offsetWidth,
            height: container.offsetHeight,
            container
        })


        // 

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
        // this.props.elements.forEach(e => {
        //     this.addElement(e)
        // })

        // elements.forEach(e => {
        //     e.init()
        // })

        // draw.click(this.onClickBG)
    }

    addElement = (element) => {
        this.elements.push(new Element({
            draw: this.draw,
            shape: this.state.shape,
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

        this.props.deselect()
    }

    render() {
        var blurClass = ''
        if (this.props.loading) {
            blurClass = 'blur'
        }
        // state

        return (
            <svg
                style={{
                    width: '100%',
                    height: '100vh',
                    // background: 'red'
                }}
                ref={(c) => this.container = c}
            // onClick={this.onClickBG}
            >
                {/* <rect x="0" y="0" width={this.state.width} height={this.state.height}> */}
                {this.props.elements.map(e => {
                    return (
                        <Element
                            key={e.id}
                            start={e.start}
                            end={e.end}
                            selected={e.selected}
                            id={e.id}
                            shape={this.state.shape}
                            container={this.state.container}
                            changeElement={this.props.changeElement}
                            selectElement={this.props.selectElement}
                            deselectElement={this.props.deselectElement}
                        />
                    )
                })}

                <Rail
                    shape={this.state.shape}
                />

                {this.state.shape.elements.map(e => (
                    <g key={Math.random()}>
                        {/* <circle cx={e.startPoint.x} cy={e.startPoint.y} r="4" /> */}
                        {/* <circle cx={e.endPoint.x} cy={e.endPoint.y} r="4" /> */}
                        {/* <path
                            d={`
                            M ${e.startPoint.x} ${e.startPoint.y}
                            A ${e.circleRadius} ${e.circleRadius} 0 0 1
                            ${e.endPoint.x} ${e.endPoint.y}
                            `}
                            fill="none"
                            stroke="green"
                        /> */}
                    </g>

                ))}
                {/* </rect> */}
            </svg>
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