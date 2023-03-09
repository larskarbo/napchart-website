import { duration, minutesToReadable } from '../../helperFunctions'
import { minutesToXY } from '../../shape/shapeHelpers'
import { NapchartType } from '../../types'
import { colorToHex, fontSize } from '../canvasHelpers'

export default function colorTags(chart: NapchartType) {
  var ctx = chart.ctx
  var config = chart.config

  ctx.save()

  ctx.fillStyle = 'black'
  var textPosition = minutesToXY(
    chart,
    chart.shape.centerMinutes,
    chart.shape.lanes[0].start - (chart.shape.laneMinRadius / 2) * chart.ratio,
  )

  var colorTags = chart.data.colorTags
  colorTags.forEach(function (tagObj) {
    if (tagObj.tag.length == 0) return
    textPosition.y += config.colorTagsSize * 1.5
    var minutes = chart.data.elements.reduce((minutes, element) => {
      if (element.color == tagObj.color) {
        return minutes + duration(element.start, element.end)
      } else {
        return minutes
      }
    }, 0)
    var text = tagObj.tag + ': ' + minutesToReadable(minutes)
    ctx.font = fontSize(chart, config.tagsTextSize)

    ctx.fillText(text, textPosition.x, textPosition.y)

    var squareSize = config.tagsTextSize

    var width = ctx.measureText(text).width
    var squarePosition = {
      x: textPosition.x - width / 2 - squareSize - config.tagsTextSize / 2,
      y: textPosition.y - config.tagsTextSize / 2,
    }
    ctx.save()

    ctx.fillStyle = colorToHex(chart, tagObj.color)
    ctx.fillRect(squarePosition.x, squarePosition.y, squareSize, squareSize)
    ctx.restore()
  })

  ctx.restore()
}
