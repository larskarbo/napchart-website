import { NapchartType } from '../types'

export const clearChart = (chart: NapchartType) => {
  const { ctx } = chart
  ctx.clearRect(0, 0, chart.w, chart.h)
}
