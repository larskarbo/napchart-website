const { createCurve } = require('../../shape/shapeHelpers')
module.exports = function (chart) {
  const { ctx } = chart
  var lanes = chart.shape.lanes

  if (!chart.config.drawFace) {
    return
  }

  ctx.lineWidth = chart.config.face.stroke
  ctx.strokeStyle = chart.config.face.strokeColor

  ctx.save()
  ctx.strokeStyle = chart.config.face.weakerStrokeColor
  for (var i = 0; i < lanes.length - 1; i++) {
    // ctx.setLineDash([1, 1])

    ctx.beginPath()
    createCurve(chart, chart.ctx, 0.01, 1439.9, lanes[i].end)
    ctx.stroke()

    ctx.setLineDash([])
  }
  ctx.restore()

  ctx.beginPath()
  createCurve(chart, chart.ctx, 0.01, 1439.9, lanes[0].start)
  ctx.stroke()

  ctx.beginPath()
  createCurve(chart, chart.ctx, 0.01, 1439.9, lanes[lanes.length - 1].end)
  ctx.stroke()
}
