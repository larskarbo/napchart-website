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

    componentDidMount() {

        const container = ReactDOM.findDOMNode(this.container)
        var ctx = window.SVG(container)
        // var rect = ctx.rect(100, 100).attr({ fill: '#f06' })

        // rect.mouseover(function () {
        //     this.fill({ color: '#0f5' })
        // })


        const shape = new View({
            width: container.offsetWidth,
            height: container.offsetHeight
        }).getShape()

        // for (let i = 0; i < 48; i++) {
        //     const c1 = new Circle({
        //         ctx,
        //         shape,
        //         minutes: i * 30,
        //         delay: i* 20
        //     })
        // }

        // const c1 = new Rail({
        //     ctx,
        //     shape
        // })
        console.log(ctx)

        this.props.elements.forEach(e => {

            new Element({
                ctx,
                shape,
                start: e.start,
                end: e.end,
                svg: ctx.node
            })
        })
        

        console.log(this.props)
        console.log('this.props: ', this.props);

    }

    render() {
        var blurClass = ''
        if (this.props.loading) {
            blurClass = 'blur'
        }
        return (
            <div style={{
                width: '100%',
                height: '100vh',
                // background: 'red'
            }} ref={(c) => this.container = c}>
            </div>
        )
    }
}
