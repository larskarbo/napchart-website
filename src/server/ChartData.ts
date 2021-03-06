export interface ChartData {
  elements: ChartElement[]
  colorTags: ColorTag[]
  shape: 'circle' | 'wide' | 'line'
  lanes: number
  lanesConfig?: {}
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
