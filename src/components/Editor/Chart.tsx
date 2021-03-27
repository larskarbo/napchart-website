import Napchart from '../../../napchart-canvas/lib/index'
import React, { useEffect, useRef, useState } from 'react'
import { drawOnly } from '../../../napchart-canvas/lib/drawOnly'

let lastData = ''
export default function Chart({
  napchartObject,
  interactive = true,
  responsive = false,
  fullHeight = false,
  onUpdate,
  chartData,
  setGlobalNapchart,
  amPm,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      const destroyers = initializeChart(canvasRef.current)

      return () => {
        destroyers.forEach((fn) => fn())
      }
    }
  }, [])

  const initializeChart = (canvas) => {
    var ctx = canvas.getContext('2d')

    var napchart = Napchart.init(ctx, chartData || {}, {
      responsive,
      ampm: amPm,
      interaction: interactive,
    })

    // drawOnly(ctx, chartData, {

    // })
    // return

    lastData = JSON.stringify(napchart.data)

    if (onUpdate) {
      napchart.onUpdate = () => {
        // TODO refactor
        const nowData = JSON.stringify(napchart.data)
        if (nowData != lastData) {
          lastData = nowData
          onUpdate()
        }
      }
    }

    setGlobalNapchart?.(napchart)

    return napchart.destroyers
  }

  return (
    <div className={`${fullHeight ? 'h-screen' : ''}`}>
      <canvas id="asdf" className={`canvas`} ref={canvasRef}>
        A chart
      </canvas>
    </div>
  )
}
