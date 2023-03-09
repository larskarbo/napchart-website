import { baseConfig } from './baseConfig'
import helpers from './helpers'
import { calculateShape } from './shape/calculateShape'
import initedShapes from './shape/shapes2'
import { fullDraw } from './draw/draw'

export function drawOnly(ctx, data, config) {
  const dData = {
    elements: [],
    colorTags: [],
    shape: 'circle',
    lanes: 1,
    lanesConfig: {
      1: {
        locked: false,
      },
    },
  }

  const shape = calculateShape({
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    config: baseConfig,
    baseShapeObject: initedShapes.circle,
    ratio: 1,
    numLanes: 2,
  })

  fullDraw(
    {
      ctx,
      canvas: ctx.canvas,
      config: baseConfig,
      helpers: helpers,
      shape: shape,
      data: {
        ...dData,
        ...data,
      },
    },
    true,
  )
}
