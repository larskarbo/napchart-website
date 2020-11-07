import React, { useState, useRef, useEffect } from 'react'
import Napchart from 'napchart'

export default ({ data }) => {
  const canvasRef = useRef(null)
  const [napchart, setNapchart] = useState(null)

  useEffect(() => {
    if (canvasRef.current) {
      const napchart = new window.Napchart(canvasRef.current)
      setNapchart(napchart)
      //
    }
  }, [canvasRef])

  useEffect(() => {
    if (napchart && data) {
      napchart.setData(data)
    }
  }, [napchart, data])

  return <canvas width={400} height={400} ref={canvasRef}></canvas>
}
