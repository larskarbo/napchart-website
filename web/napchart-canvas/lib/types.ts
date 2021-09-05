import { ChartData } from "../../src/components/Editor/types";

export interface chart {
  data: ChartData
  shape: any
  config: any
  ctx: CanvasRenderingContext2D
  draw: () => void
  history: any
}


export interface InteractionState {
  hoverElement: {
    id: number
    type: 'start' | 'end' | 'middle'
  }
  activeElement: {
    id: number
    type: 'start' | 'end' | 'middle'
    positionInElement: number
  }
  selectedElement: number
}
