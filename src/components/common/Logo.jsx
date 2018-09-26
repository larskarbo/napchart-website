import React from 'react'
import Napchart from '../../draw/lib'
import classNames from 'classnames'
import uuid from 'uuid'

export default class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      napchart: false,
      hasStartedSpinning: false,
      ref: uuid.v4()
    }
  }

  componentDidMount() {
    this.initializeChart()
  }

  render() {
    if (this.props.loading && !this.state.hasStartedSpinning && this.state.napchart) {
      this.spinLoad()
    }

    var height = this.props.height
    return (
      <div className={"logoContainer " + this.props.className}>
        <div className="canvasParent" style={{ width: height + 'px' }}>
          <canvas width={height} height={height} ref={this.state.ref}></canvas>
        </div>
        <div className="text">
          {this.props.logoText &&
            <span style={{ fontSize: height / 2 }}
              className={classNames("logoText", { dark: this.props.whiteBG })}
            >{this.props.logoText}</span>
          }

          {height > 120 &&
            <span className={classNames("slogan", { dark: this.props.whiteBG })}>
              24 hour time-planner
            </span>
          }
        </div>
      </div>
    )
  }

  initializeChart() {
    var canvas = this.refs[this.state.ref]
    var ctx = canvas.getContext('2d')

    var elements = [{
      "end": 320, "start": 30, "lane": 0, "id": 4082, "text": "", "color": "red", "duration": 240
    }, {
      "end": 680, "start": 390, "lane": 0, "id": 545, "text": "", "color": "green", "duration": 240
    }, {
      "start": 750, "end": 1040, "lane": 0, "id": 8540, "text": "", "color": "brown", "duration": 240
    }, {
      "start": 1110, "end": 1400, "lane": 0, "id": 9693, "text": "", "color": "yellow", "duration": 240
    }]

    if (this.props.white) {
      elements = elements.map(e => ({
        ...e,
        color: 'white'
      }))
    }

    var napchart = Napchart.init(ctx, {
      elements: elements,
      shape: 'miniCircle',
      lanes: 1
    }, {
        text: false,
        drawFace: false,
        interaction: !this.props.noInteraction ? true : false
      })

    napchart.data.elements.forEach(element => {
      element.initialStart = element.start
      element.initialEnd = element.end
    })

    this.state.napchart = napchart
  }

  spinLoad = (callback) => {
    this.setState({
      hasStartedSpinning: true
    })

    var shouldIContinue = () => {
      if (this.props.loading) {
        this.continueSpin(shouldIContinue)
      } else {
        this.endSpin(() => {
          this.setState({
            hasStartedSpinning: false
          })
        })
      }
    }

    this.startSpin(() => {
      this.continueSpin(shouldIContinue)
    })
  }

  startSpin = (callback) => {
    this.spin(500, easingEffects.easeInSine, 290, 1440 / 4, callback)
  }

  continueSpin = (callback) => {
    this.spin(250, easingEffects.linear, 1440 / 4, 1440 / 4, callback)
  }

  endSpin = (callback) => {
    this.spin(500, easingEffects.easeOutSine, 1440 / 4, 290, callback)
  }

  spin(duration, easingEffect, animateFromDuration, animateToDuration, callback) {
    var napchart = this.state.napchart

    var start = Date.now()

    function step() {
      var now = Date.now()
      var progress = Math.min((now - start) / duration, 1)
      if (progress >= 1) {
        return callback()
      }
      var progress = easingEffect(progress)


      var newElements = napchart.data.elements.map(element => {
        var distance = 1440

        var sizeAnimate = 36 * progress
        var thisDuration = animateFromDuration + (animateToDuration - animateFromDuration) * progress
        // console.log(sizeAnimate)
        var start = element.initialStart + distance * progress - sizeAnimate
        var end = start + thisDuration
        return {
          ...element,
          start,
          end// + distance * progress + sizeAnimate
        }
      })
      napchart.setElements(newElements)
      if (progress < 1) {
        // console.log(progress)
        requestAnimationFrame(step)
      }
    }

    step()
  }

}

var easingEffects = {
  linear: function (t) {
    return t
  },
  easeInQuad: function (t) {
    return t * t
  },
  easeOutQuad: function (t) {
    return -1 * t * (t - 2)
  },
  easeInOutQuad: function (t) {
    if ((t /= 1 / 2) < 1) {
      return 1 / 2 * t * t
    }
    return -1 / 2 * ((--t) * (t - 2) - 1)
  },
  easeInCubic: function (t) {
    return t * t * t
  },
  easeOutCubic: function (t) {
    return 1 * ((t = t / 1 - 1) * t * t + 1)
  },
  easeInOutCubic: function (t) {
    if ((t /= 1 / 2) < 1) {
      return 1 / 2 * t * t * t
    }
    return 1 / 2 * ((t -= 2) * t * t + 2)
  },
  easeInQuart: function (t) {
    return t * t * t * t
  },
  easeOutQuart: function (t) {
    return -1 * ((t = t / 1 - 1) * t * t * t - 1)
  },
  easeInOutQuart: function (t) {
    if ((t /= 1 / 2) < 1) {
      return 1 / 2 * t * t * t * t
    }
    return -1 / 2 * ((t -= 2) * t * t * t - 2)
  },
  easeInQuint: function (t) {
    return 1 * (t /= 1) * t * t * t * t
  },
  easeOutQuint: function (t) {
    return 1 * ((t = t / 1 - 1) * t * t * t * t + 1)
  },
  easeInOutQuint: function (t) {
    if ((t /= 1 / 2) < 1) {
      return 1 / 2 * t * t * t * t * t
    }
    return 1 / 2 * ((t -= 2) * t * t * t * t + 2)
  },
  easeInSine: function (t) {
    return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1
  },
  easeOutSine: function (t) {
    return 1 * Math.sin(t / 1 * (Math.PI / 2))
  },
  easeInOutSine: function (t) {
    return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1)
  },
  easeInExpo: function (t) {
    return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1))
  },
  easeOutExpo: function (t) {
    return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1)
  },
  easeInOutExpo: function (t) {
    if (t === 0) {
      return 0
    }
    if (t === 1) {
      return 1
    }
    if ((t /= 1 / 2) < 1) {
      return 1 / 2 * Math.pow(2, 10 * (t - 1))
    }
    return 1 / 2 * (-Math.pow(2, -10 * --t) + 2)
  },
  easeInCirc: function (t) {
    if (t >= 1) {
      return t
    }
    return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1)
  },
  easeOutCirc: function (t) {
    return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t)
  },
  easeInOutCirc: function (t) {
    if ((t /= 1 / 2) < 1) {
      return -1 / 2 * (Math.sqrt(1 - t * t) - 1)
    }
    return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1)
  },
  easeInElastic: function (t) {
    var s = 1.70158
    var p = 0
    var a = 1
    if (t === 0) {
      return 0
    }
    if ((t /= 1) === 1) {
      return 1
    }
    if (!p) {
      p = 1 * 0.3
    }
    if (a < Math.abs(1)) {
      a = 1
      s = p / 4
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a)
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p))
  },
  easeOutElastic: function (t) {
    var s = 1.70158
    var p = 0
    var a = 1
    if (t === 0) {
      return 0
    }
    if ((t /= 1) === 1) {
      return 1
    }
    if (!p) {
      p = 1 * 0.3
    }
    if (a < Math.abs(1)) {
      a = 1
      s = p / 4
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a)
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1
  },
  easeInOutElastic: function (t) {
    var s = 1.70158
    var p = 0
    var a = 1
    if (t === 0) {
      return 0
    }
    if ((t /= 1 / 2) === 2) {
      return 1
    }
    if (!p) {
      p = 1 * (0.3 * 1.5)
    }
    if (a < Math.abs(1)) {
      a = 1
      s = p / 4
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a)
    }
    if (t < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p))
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1
  },
  easeInBack: function (t) {
    var s = 1.70158
    return 1 * (t /= 1) * t * ((s + 1) * t - s)
  },
  easeOutBack: function (t) {
    var s = 1.70158
    return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1)
  },
  easeInOutBack: function (t) {
    var s = 1.70158
    if ((t /= 1 / 2) < 1) {
      return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s))
    }
    return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2)
  },
  easeInBounce: function (t) {
    return 1 - easingEffects.easeOutBounce(1 - t)
  },
  easeOutBounce: function (t) {
    if ((t /= 1) < (1 / 2.75)) {
      return 1 * (7.5625 * t * t)
    } else if (t < (2 / 2.75)) {
      return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75)
    } else if (t < (2.5 / 2.75)) {
      return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375)
    }
    return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375)
  },
  easeInOutBounce: function (t) {
    if (t < 1 / 2) {
      return easingEffects.easeInBounce(t * 2) * 0.5
    }
    return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5
  }
}