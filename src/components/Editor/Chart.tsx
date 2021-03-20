import Napchart from '../../../napchart-canvas/lib/index'
import React, { useEffect, useRef, useState } from 'react'


let lastData = ""
export default function Chart({ napchartObject, onUpdate, chartData, setGlobalNapchart, amPm }) {
  const [dimensions, setDimensions] = useState({
    width: 500,
    height: 500,
  })
  const resizerRef = useRef(null)
  const canvasRef = useRef(null)
3
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
    })

    lastData = JSON.stringify(napchart.data)

    // for debugging
    // window.napchart = napchart

    // canvas.oncontextmenu = function (event) {
    //   event.preventDefault()
    //   event.stopPropagation()
    //   return false
    // }

    napchart.onUpdate = () => {
      // TODO refactor
      const nowData = JSON.stringify(napchart.data)
      if(nowData != lastData){
        lastData = nowData
        onUpdate()
      }
    }

    setGlobalNapchart(napchart)
  }

  return (
    <div className="Chart" ref={resizerRef}>
      <canvas id="asdf" className={`canvas`} ref={canvasRef}>
        A chart
      </canvas>
    </div>
  )
}
