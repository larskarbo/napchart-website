export interface NapChart {
  data: NapChartData
  forceFocusSelected: any
  isTouchUser: boolean
  history: any
  selectedElement: any
  changeShape: () => void
  addLane: () => void
  setNumberOfLanes: (number) => void
  config: any
  getLaneConfig: (index: number) => any
  toggleLockLane: () => void
  deleteLane: () => void
  helpers: any
}

export interface NapChartData {
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
