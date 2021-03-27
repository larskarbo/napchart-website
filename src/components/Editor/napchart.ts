export interface ChartDocument {
  chartData: ChartData
  chartid: string
  title?: string
  description?: string
}

interface ChartData {
  elements: Element[]
  colorTags: any
  shape: 'circle' | 'wide' | 'line'
  lanes: number
  lanesConfig: {}
}

interface Element {
  start: number
  end: number
  lane: number
  text: string
  color: string
  id: number
  duration: number
}
