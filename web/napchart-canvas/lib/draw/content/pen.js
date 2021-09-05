module.exports = function (chart) {
  var ctx = chart.ctx
  var helpers = chart.helpers
  var config = chart.config
  if (chart.isPen()) {
    var minutes = chart.mousePenLocation.minutes
    var lane = chart.shape.lanes[chart.mousePenLocation.lane]

    ctx.save()
    ctx.fillStyle = helpers.colorMap(chart.config.defaultColor || "red")
    ctx.globalAlpha = 0.5
    var start = helpers.limit(minutes - 1)
    var end = helpers.limit(minutes + 1)
    const path = helpers.createSegment(
      chart,
      lane.end - config.paddingLanes,
      lane.start + config.paddingLanes,
      start,
      end,
    )
    ctx.fill(path)

    ctx.restore()
  }
}
