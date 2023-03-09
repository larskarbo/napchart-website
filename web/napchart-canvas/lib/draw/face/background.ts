import { NapchartType } from '../../types'

export function drawBackground(chart: NapchartType): void {
  const ctx = chart.ctx
  if (chart.config.background !== 'transparent') {
    ctx.save()
    ctx.fillStyle = chart.config.background

    ctx.fillRect(0, 0, chart.w, chart.h)

    ctx.restore()
  }
}
