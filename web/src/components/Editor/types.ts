export interface ChartDocument {
  chartData: ChartData
  chartid: string
  title?: string
  description?: string
  isSnapshot: boolean
  isPrivate: boolean
  lastUpdated: Date
  username: string
}

export interface ChartData {
  elements: Element[]
  colorTags: ColorTag[]
  shape: 'circle' | 'wide' | 'line' | "miniCircle"
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

interface ColorTag {
  color: string
  tag: string
}
