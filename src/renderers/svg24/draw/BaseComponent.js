import helpers from '../helpers'

export default class BaseComponent {
    constructor(props) {
        this.props = props
    }

    animate = (dur, eas, fun, callback) => {
        const initTime = performance.now()
        const duration = dur || 400
        const easing = eas || 'easeInOutCubic'

        const animLoop = () => {
            const timeStamp = performance.now()
            const animationProgress = Math.max(Math.min(((timeStamp - initTime)) / duration, 1), 0)
            const withEasing = helpers.easingEffects[easing](animationProgress)

            fun(withEasing)

            if (animationProgress < 1) {
                requestAnimationFrame(animLoop)
            } else {
                callback()
            }
        }

        requestAnimationFrame(animLoop)
    }

}