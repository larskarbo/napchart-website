import Napchart from '../../../napchart-canvas/lib/index'
import React, { useEffect, useRef, useState } from 'react'
import { drawOnly } from '../../../napchart-canvas/lib/drawOnly';

let lastData = ''
export default function Chart({ napchartObject, interactive=true, fullHeight=false, onUpdate, chartData, setGlobalNapchart, amPm }) {
  const [dimensions, setDimensions] = useState({
    width: 500,
    height: 500,
  })
  const resizerRef = useRef(null)
  const canvasRef = useRef(null)
  
  useEffect(() => {
    if (canvasRef.current) {
      initializeChart(canvasRef.current)
    }
  }, [])

  const initializeChart = (canvas) => {
    var ctx = canvas.getContext('2d')

    var napchart = Napchart.init(ctx, chartData || {}, {
      responsive: true,
      ampm: amPm,
      interactive: interactive,
    })

    // drawOnly(ctx, chartData, {

    // })


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
  }

  return (
    <div className={`${fullHeight ? "h-screen" : ""}`} ref={resizerRef}>
      <canvas id="asdf" className={`canvas`} ref={canvasRef}>
        A chart
      </canvas>
    </div>
  )
}
