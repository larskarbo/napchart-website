import React, { useEffect, useRef } from 'react'
import { NapchartConfig } from '../../../napchart-canvas/lib/baseConfig'
import Napchart from '../../../napchart-canvas/lib/index'
import { NapchartType } from '../../../napchart-canvas/lib/types'
import { ChartData } from './types'

let lastData = ''
export default function Chart({
  interactive = true,
  responsive = false,
  onUpdate,
  chartData,
  setGlobalNapchart,
  amPm,
  config = {},
}: {
  interactive?: boolean
  responsive?: boolean
  onUpdate?: () => void
  chartData?: ChartData
  setGlobalNapchart?: (napchart: NapchartType) => void
  amPm?: boolean
  config?: Partial<NapchartConfig>
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

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.oncontextmenu = (e) => {
        e.preventDefault()
      }
    }
  }, [])

  const initializeChart = (canvas: HTMLCanvasElement) => {
    var ctx = canvas.getContext('2d')

    var napchart = Napchart.init(ctx, chartData || {}, {
      responsive,
      ampm: amPm,
      interaction: interactive,
      ...config,
    })

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
    <canvas id="asdf" className={`canvas`} ref={canvasRef}>
      A chart
    </canvas>
  )
}
