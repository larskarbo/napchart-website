import Napchart from 'napchart'
import React, { useEffect, useRef, useState } from 'react'

export default function Chart({ napchartObject, chartData, setGlobalNapchart, amPm }) {
  const [dimensions, setDimensions] = useState({
    width: 500,
    height: 500,
  })
  const resizerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      setTimeout(() => {
        initializeChart()
      }, 500)
    }
  }, [chartData, canvasRef.current])

  const initializeChart = () => {
    var canvas = canvasRef.current
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
