module.exports = function (chart) {
  var ctx = chart.ctx
  var helpers = chart.helpers
  var config = chart.config

  // we need to go through one lane at the time and check if we
  // should draw distances

  chart.shape.lanes.forEach(function (lane, i) {
    var elementsWithThisLane = chart.data.elements.filter(e => e.lane == i)
    if (chart.getLaneConfig(i).locked && elementsWithThisLane.length > 0) {
      drawDistanceToElements(elementsWithThisLane, true)
    } else {
      elementsWithThisLane.forEach(function (element) {
        if (chart.isSelected(element.id)) {
          drawDistanceToElements(elementsWithThisLane, false)
        }
      })
    }
  })

  function drawDistanceToElements(elements, locked) {
    var lane = chart.shape.lanes[elements[0].lane]

    ctx.save()

    // sort array
    elements = elements.sort(function (a, b) {
      return a.start - b.start
    })

    // SECOND - draw
    ctx.fillStyle = config.face.strokeColor
    ctx.strokeStyle = config.face.weakStrokeColor
    if (locked) {
      ctx.strokeStyle = config.face.strokeColor
      ctx.lineWidth = config.face.importantLineWidth
    }
    // push start and endpoints to draw elements
    var drawArr = []
    elements.forEach((el, i) => {
      if (i == elements.length - 1) {
        var next = elements[0]
      } else {
        var next = elements[i + 1]
      }

      drawArr.push({
        start: el.end,
        end: next.start
      })
    })

    var radius = lane.start + (lane.end - lane.start) / 3
    var textRadius = lane.start + (lane.end - lane.start) * 2 / 3

    drawArr.forEach(function (element) {
      var distance = helpers.duration(element.start, element.end)
      var text = helpers.minutesToReadable(distance, 120)

      if (distance >= 60) {
        var start = helpers.limit(element.start + 15)
        var end = helpers.limit(element.end - 15)
        var middle = helpers.limit(start + (distance / 2))

        ctx.beginPath()
        // stroke
        helpers.createCurve(chart, start, end, radius, false, () => {
          ctx.stroke()
        })

        ctx.font = helpers.fontSize(chart, config.fontSize.small)

        // TODO
        // subracting 10 because of text width
        // should probably find a way to calculate it better
        var middleXY = helpers.minutesToXY(chart, middle - 10, textRadius)
        // text
        ctx.fillText(text, middleXY.x, middleXY.y)
      }
    })

    ctx.restore()
  }
}