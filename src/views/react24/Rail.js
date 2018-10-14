import React from 'react'
import BaseComponent from './BaseComponent'

export default class Rail extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            anim1: 1,
            anim2: 0,
            anim3: 0
        }

    }

    componentDidMount() {
        // this.animate({
        //     duration: 100000,
        //     easing: 'linear'
        // }, (progress) => {
        //     this.setState({
        //         anim1: Math.sin(progress * 300)
        //     })
        // })

        // this.animate({
        //     duration: 100000,
        //     easing: 'linear'
        // }, (progress) => {
        //     this.setState({
        //         anim3: Math.sin(progress * 200)
        //     })
        // })
        // this.animate({
        //     duration: 500,
        //     delay: 200
        // }, (progress) => {
        //     this.setState({
        //         anim2: progress
        //     })
        // })
    }

    render() {

        // const path = this.createCurve('', 0, 720 + this.state.anim1 * 720, this.state.anim3 * 30)
        const path = this.createCurve('', 0, 1439, this.state.anim3 * 30)
        // const pathSmall = this.createCurve('', 0, this.state.anim2 * 1440, 0)
        return (
            <g>
                {/* <path
                    d={pathSmall}
                    fill="none"
                    stroke="gray"
                /> */}
                <path
                    d={path}
                    fill="none"
                    stroke="gray"
                />
            </g>
        )
    }
}
