export interface NapChart {
  data: NapChartData;
  forceFocusSelected: any;
  isTouchUser: boolean;
  history: any;
  selectedElement: any;
  changeShape: () => void;
  addLane: () => void;
  setNumberOfLanes: (number) => void;
  config: any;
  getLaneConfig: (index: number) => any;
  toggleLockLane: () => void;
  deleteLane: () => void;
  helpers: any;
}

export interface NapChartData {
  elements: Element[];
  colorTags: any;
  shape: string;
  lanes: number;
  lanesConfig: {};
}

interface Element {
  start: number;
  end: number;
  id: number;
  lane: number;
  text: string;
  color: string;
  duration: number;
}
