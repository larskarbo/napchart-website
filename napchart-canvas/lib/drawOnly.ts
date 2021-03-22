import drawExtender from "./draw/draw"
import { baseConfig } from './baseConfig';
import helpers from './helpers';

export function drawOnly (ctx, data, config) {
    const obj = {}

    const drawFns = drawExtender(obj)
    console.log('drawFns: ', drawFns);

    drawFns.fullDraw({
        ctx,
        canvas: ctx.canvas,
        config: baseConfig,
        helpers: helpers
    }, true)
}