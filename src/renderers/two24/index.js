import React from 'react'
import ReactDOM from 'react-dom';
import Two from 'two.js'
import Snap from 'snapsvg-cjs';
import Sector from 'paths-js/sector'
// import SVG from 'svg.js'
import Circle from './Circle'
import Rail from './Rail'
import Segment from './Segment'
import View from './View';

export default class Two24 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.segments = []
    }

    shouldComponentUpdate(nextProps) {
        // return false, because this component always gets its updates directly
        // through operations in the onOperations function

        return false
    }

    onOperations(operations) {
        operations.forEach(operation => {
            const { data } = operation
            
            

            switch (operation.type) {
                case 'change_element':
                    this.changeSegment(data.id, data.newAttrs)
                    return
                case 'select_element':
                    this.changeSegment(data.id, {})
                    return
                default:
                    throw new Error('Couldn\'t find anything to do with operation ' + operation.type)
            }
        })

    }

    componentDidMount() {
        const container = ReactDOM.findDOMNode(this.container)
        const draw = this.draw = window.SVG(container)


        const shape = new View({
            width: container.offsetWidth,
            height: container.offsetHeight
        }).getShape()
        this.shape = shape

        const pathGen = (size, orientation) => {
            const s = size
            switch (orientation) {
                case '0/8':
                case 'vertical':
                    return `M ${s / 2}, 0 l 0, ${s}`;
                case '1/8':
                    return `M ${s / 4},0 l ${s / 2},${s} M ${-s / 4},0 l ${s / 2},${s} M ${s * 3 / 4},0 l ${s / 2},${s}`;
                case '2/8':
                case 'diagonal':
                    return `M 0,${s} l ${s},${-s} M ${-s / 4},${s / 4} l ${s / 2},${-s / 2} M ${3 / 4 * s},${5 / 4 * s} l ${s / 2},${-s / 2}`;
                case '3/8':
                    return `M 0,${3 / 4 * s} l ${s},${-s / 2} M 0,${s / 4} l ${s},${-s / 2} M 0,${s * 5 / 4} l ${s},${-s / 2}`;
                case '4/8':
                case 'horizontal':
                    return `M 0,${s / 2} l ${s},0`;
                case '5/8':
                    return `M 0,${-s / 4} l ${s},${s / 2}M 0,${s / 4} l ${s},${s / 2} M 0,${s * 3 / 4} l ${s},${s / 2}`;
                case '6/8':
                    return `M 0,0 l ${s},${s} M ${-s / 4},${3 / 4 * s} l ${s / 2},${s / 2} M ${s * 3 / 4},${-s / 4} l ${s / 2},${s / 2}`;
                case '7/8':
                    return `M ${-s / 4},0 l ${s / 2},${s} M ${s / 4},0 l ${s / 2},${s} M ${s * 3 / 4},0 l ${s / 2},${s}`;
                default:
                    return `M ${s / 2}, 0 l 0, ${s}`;
            }
        };

        
        // initialize patterns
        const patternSize = 10
        this.patterns = [
            draw.pattern(patternSize, patternSize, function (add) {
                add.rect(patternSize, patternSize).fill('#fdf5e6')
                add.path(pathGen(patternSize, '0/8')).stroke({ color: '#343434', width: 1, linecap: 'round', linejoin: 'round' })
            }),
            draw.pattern(10, 10, function (add) {
                add.rect(10, 10).fill('#ded6c7')
                add.path(pathGen(10, '0/8')).stroke({ color: '#343434', width: 1, linecap: 'round', linejoin: 'round' })
            })
        ]

        draw.rect(container.offsetWidth, container.offsetHeight)
            .fill('transparent')
            .click(this.onClickBG)

        const c1 = new Rail({
            draw,
            shape
        })


        // simulating z-index with two groups
        this.lowGroup = draw.group()
        this.highGroup = draw.group()


        this.props.value.elements.forEach(e => {
            this.addSegment(e)
        })
    }

    addSegment = (element) => {
        this.segments.push(new Segment({
            element,
            draw: this.draw,
            highGroup: this.highGroup,
            lowGroup: this.lowGroup,
            shape: this.shape,
            onChangeElement: this.props.changeElement,
            onClick: this.props.selectElement,
            patterns: this.patterns
        }).init())
    }

    deleteSegment = (id) => {
        const element = this.elements.find(e => id == e.id)

        element.destroy()
        this.elements = this.elements.filter(e => e.id != id)
    }

    changeSegment = (id, newAttrs) => {
        
        const segment = this.segments.find(s => id == s.element.id)

        segment.updateElement(newAttrs)
        segment.render()
    }

    onClickBG = () => {
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