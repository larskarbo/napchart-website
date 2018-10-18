import React from 'react'
import ReactDOM from 'react-dom';
import Circles from './draw/Circles'
import Segment from './draw/Segment'
import View from './shape/View';

export default class Svg24 extends React.Component {
    constructor(props) {
        super(props)

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
                case 'add_element':
                    this.addSegment(data.newElement)
                    return
                default:
                    throw new Error('Renderer is ignoring the operation: ' + operation.type)
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

        // begin initialize patterns
        // todo move to own module
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
        // end initialize patterns

        // make transparent background rect used for event listening
        draw.rect(container.offsetWidth, container.offsetHeight)
            .fill('transparent')
            .click(this.onClickBG)

        
        const c1 = new Circles({
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

    changeSegment = (id, newAttrs) => {
        const segment = this.segments.find(s => id == s.element.id)

        segment.updateElement(newAttrs)
    }

    onClickBG = () => {
        this.props.deselect()
    }

    render() {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                }}
                ref={(c) => this.container = c}
            >
            </div>
        )
    }
}