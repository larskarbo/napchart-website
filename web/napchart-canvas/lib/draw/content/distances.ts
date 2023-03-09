import { Element } from '../../../../src/components/Editor/types'
import { duration, limit, minutesToReadable } from '../../helperFunctions'
import { createCurve, minutesToXY } from '../../shape/shapeHelpers'
import { fontSize } from '../canvasHelpers'

import { NapchartType } from '../../types'

export const drawDistances = (chart: NapchartType): void => {
  const ctx = chart.ctx
  const config = chart.config

  // we need to go through one lane at the time and check if we
  // should draw distances

  chart.shape.lanes.forEach((lane, i) => {
    const elementsWithThisLane = chart.data.elements.filter((e) => e.lane === i)
    if (chart.getLaneConfig(i).locked && elementsWithThisLane.length > 0) {
      drawDistanceToElements(elementsWithThisLane, true)
    } else {
      elementsWithThisLane.forEach((element) => {
        if (chart.isSelected(element.id)) {
          drawDistanceToElements(elementsWithThisLane, false)
        }
      })
    }
  })

  function drawDistanceToElements(elements: Element[], locked: boolean): void {
    const lane = chart.shape.lanes[elements[0].lane]

    ctx.save()

    // sort array
    elements = elements.sort((a, b) => {
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
    const drawArr: Pick<Element, 'start' | 'end'>[] = []
    elements.forEach((el, i) => {
      if (i === elements.length - 1) {
        var next = elements[0]
      } else {
        var next = elements[i + 1]
      }

      drawArr.push({
        start: el.end,
        end: next.start,
      })
    })

    const radius = lane.start + (lane.end - lane.start) / 3
    const textRadius = lane.start + ((lane.end - lane.start) * 2) / 3

    drawArr.forEach(function (element) {
      const distance = duration(element.start, element.end)
      const text = minutesToReadable(distance, 120)

      if (distance >= 60) {
        const start = limit(element.start + 15)
        const end = limit(element.end - 15)
        const middle = limit(start + distance / 2)

        ctx.beginPath()
        // stroke
        createCurve(chart, chart.ctx, start, end, radius, false, () => {
          ctx.stroke()
        })

        ctx.font = fontSize(chart, config.fontSize.small)

        // TODO
        // subtracting 10 because of text width
        // should probably find a way to calculate it better
        const middleXY = minutesToXY(chart, middle - 10, textRadius)
        // text
        ctx.fillText(text, middleXY.x, middleXY.y)
      }
    })

    ctx.restore()
  }
}
