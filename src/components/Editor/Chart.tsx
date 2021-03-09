import Napchart from 'napchart'
import React, { useEffect, useRef, useState } from 'react'

export default function Chart({ napchartObject, onUpdate, chartData, setGlobalNapchart, amPm }) {
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
  }, [canvasRef.current])

  const initializeChart = (canvas) => {
    var ctx = canvas.getContext('2d')

    var napchart = Napchart.init(ctx, chartData || {}, {
      responsive: true,
      ampm: amPm,
    })

    // for debugging
    window.napchart = napchart

    // canvas.oncontextmenu = function (event) {
    //   event.preventDefault()
    //   event.stopPropagation()
    //   return false
    // }

    napchart.onUpdate = () => {
      // TODO refactor
      onUpdate()
    }

    setGlobalNapchart(napchart)
  }

  return (
    <div className="Chart" ref={resizerRef}>
      <canvas className={`canvas`} ref={canvasRef}>
        A chart
      </canvas>
    </div>
  )
}
