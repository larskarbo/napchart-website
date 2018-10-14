import React from 'react'

import BaseComponent from './BaseComponent'
import helpers from './helpers'
import rough from 'roughjs'

import { lines } from 'svg-patterns'

export default class Element extends BaseComponent {
    constructor(props) {
        super(props)

        // this.draw = props.draw
        this.state = {
            start: props.start,
            end: props.end,
        }


        // /* State: */
        // this.active = false

        // this.segment = this.draw.path()

        // this.segment.mousedown(this.down)
        // this.segment.mouseup(this.up)

        // this.handleStart = this.draw.circle().radius(50).addClass('handle')
        // this.handleEnd = this.handleStart.clone()

        // this.handleStart.mousedown(this.hsDown)
        // this.handleEnd.mousedown(this.heDown)

        // this.segment.stroke({ color: '#666666', width: 1})

        this.duration = helpers.duration(props.start, props.end)
    }

    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.start != this.state.start || nextProps.end != this.state.end) {
    //         this.state = {
    //             start: nextProps.start,
    //             end: nextProps.end,
    //         }
    //         this.duration = helpers.duration(nextProps.start, nextProps.end)

    //         return true
    //     }
    //     return false
    // }

    componentDidMount() {
        // this.animate({
        //     duration: 200,
        //     easing: 'easeInOutSine'
        // }, (progress) => {
        //     this.setState({
        //         end: helpers.limit(this.props.start + this.duration * progress),
        //     })
        // })
    }

    componentWillReceiveProps(props) {
        const diff = {
            start: props.start - this.state.start,
            end: props.end - this.state.end
        }
        const startWas = this.state.start
        const endWas = this.state.end
        this.animate({
            duration: 1,
            easing: 'linear'
        }, (progress) => {
            this.setState({
                start: helpers.limit(startWas + diff.start * progress),
                end: helpers.limit(endWas + diff.end * progress),
            })
        })
    }

    destroy() {
        const { segment } = this

        const startWas = this.props.start
        const endWas = this.props.end

        this.animate({
            duration: 200
        }, (progress) => {
            this.props.end = endWas - (progress * this.duration / 2)
            this.props.start = startWas + (progress * this.duration / 2)
            this.render()

        }, () => {
            this.segment.remove()
        })
        // segment.animate(200).attr({ fill: '#d9f442' })
    }

    render = () => {
        const { segment, handleStart, handleEnd } = this
        const { selected } = this.props
        const { start, end } = this.state

        const fill = this.selected ? "#d9f442" : '#ea552c'

        const path = this.createSegment('', start, end, 90, 5)

        

        // <rect x="0" y="0" width="100" height="100" />
        return (
            <g>
                {/* <pattern id="diagonal-stripe-2" patternUnits="userSpaceOnUse" width="10" height="10"> <image xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzInLz4KPC9zdmc+" x="0" y="0" width="10" height="10"> </image> </pattern> */}
                <path
                    d={path}
                fill={selected ? "red" : "url(#diagonal-stripe-2)"}
                    stroke="black"
                    onMouseDown={this.down}
                    onTouchStart={this.down}
                />
            </g>
        )
    }

    down = (e) => {
        this.active = 'middle'

        // this.path.animate(80).fill("#d9f442").stroke({ color: '#ce261a', width: 3 })
        // this.render()


        const info = this.XYtoInfo(this.getCoordinates(e))
        this.positionInElement = info.minutes - this.props.start

        this.props.selectElement(this.props.id)



        window.addEventListener('mouseup', this.up)
        window.addEventListener('mousemove', this.drag)
    }

    hsDown = (e) => {
        this.active = 'start'

        window.addEventListener('mouseup', this.up)
        window.addEventListener('mousemove', this.drag)
    }

    heDown = (e) => {
        this.active = 'end'

        window.addEventListener('mouseup', this.up)
        window.addEventListener('mousemove', this.drag)
    }

    up = () => {
        this.active = false

        // this.path.animate(80).fill("#ea552c").stroke({ color: '#666666', width: 1 })

        // this.props.deselectElement(this.props.id)

        window.removeEventListener('mousemove', this.drag)
        window.removeEventListener('mouseup', this.up)

    }

    drag = (e) => {
        const info = this.XYtoInfo(this.getCoordinates(e))

        if (this.active == 'middle') {
            const newStart = this.snap(helpers.limit(info.minutes - this.positionInElement))
            if (newStart != this.props.start) {
                // this.setState({
                //     start: newStart,
                //     end: helpers.limit(newStart + this.duration)
                // })
                this.props.changeElement(this.props.id, {
                    start: newStart,
                    end: helpers.limit(newStart + this.duration)
                })
            }
        }

        else if (this.active == 'start') {
            const newStart = this.snap(helpers.limit(info.minutes))
            if (newStart != this.props.start) {
                this.props.changeElement(this.props.id, {
                    start: newStart
                })
            }
        }
    }

    getCoordinates = (e) => {
        const boundingRect = this.props.container.getBoundingClientRect()
        return {
            x: (e.clientX - boundingRect.left),
            y: (e.clientY - boundingRect.top)
        }
    }

    snap = (input) => {
        return Math.round(input / 5) * 5
    }
}

function getCoordinates(position, chart) {
    var boundingRect = chart.canvas.getBoundingClientRect()
    // use window.devicePixelRatio because if a retina screen, canvas has more pixels
    // than the getCoordinates
    var dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    return {
        x: (position.x - boundingRect.left) * dpr,
        y: (position.y - boundingRect.top) * dpr
    }
}