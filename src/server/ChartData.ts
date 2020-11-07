export interface ChartData {
  title: string
  description: string
  elements: ChartElement[]
  colorTags: ColorTag[]
  shape: 'circle' | 'wide' | 'line'
  lanes: number
  lanesConfig?: {}
  user?: string
}

interface ChartElement {
  start: number
  end: number
  lane: number
  text: string
  color: string
}

interface ColorTag {
  color: string
  tag: string
}
