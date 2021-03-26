export interface chart {
  data: data
  shape: any
  config: any
  ctx: CanvasRenderingContext2D
  draw: () => void
  history: any
}

export interface data {
  elements: Element[]
  colorTags: any
  shape: 'circle' | 'wide' | 'line'
  lanes: number
  lanesConfig: {}
}

export interface Element {
  start: number
  end: number
  lane: number
  id: number
  duration: number
  text: string
  color: string
}

export interface InteractionState {
  hoverElement: {
    id: number
    type: "start" | "end" | "middle"
  },
  activeElement: {
    id: number
    type: "start" | "end" | "middle"
    positionInElement: number
  },
  selectedElement: number
}
