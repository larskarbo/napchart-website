import React from 'react'
import ReactDOM from 'react-dom';
import Two from 'two.js'
// import Snap from 'snapsvg-cjs';
import Sector from 'paths-js/sector'
// import SVG from 'svg.js'
import BaseComponent from './BaseComponent'

export default class Chart extends BaseComponent {
    constructor(props) {
        super(props)

        this.draw = props.draw
        this.state = {
        }

        const position = this.minutesToXY(props.minutes, 100)

        var rect = this.draw.circle(0).radius(10).attr({
            stroke: 'blue',
            fill: 'transparent',
            'stroke-width': 2
        }).move(position.x, position.y)

        // rect.animate(400, '<>', props.delay).radius(10).attr({
        //     'stroke-width': 20
        // })

        rect.mouseover(function () {
            this.attr({
                stroke: 'red'
            })
        })

    }

    render() {
        var blurClass = ''
        if (this.props.loading) {
            blurClass = 'blur'
        }
        return (
            <div width={700} height={600} ref={(c) => this.container = c}>
            </div>
        )
    }
}
