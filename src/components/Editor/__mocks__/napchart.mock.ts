import { NapChart } from "../napchart";

export let napChartMock: NapChart = {
  data: {
    elements: [
      {
        start: 1260,
        end: 0,
        id: 2973,
        lane: 0,
        text: "",
        color: "red",
        duration: 210,
      },
      {
        start: 120,
        end: 300,
        id: 9817,
        lane: 0,
        text: "",
        color: "red",
        duration: 210,
      },
      {
        start: 1200,
        end: 300,
        id: 2957,
        lane: 1,
        text: "",
        color: "pink",
        duration: 0,
      },
    ],
    colorTags: [],
    shape: "circle",
    lanes: 2,
    lanesConfig: {
      "0": {
        locked: true,
      },
      "1": {
        locked: false,
      },
    },
  },
  history: {
    back: jest.fn(),
    canIGoBack: jest.fn(),
    forward: jest.fn(),
    canIGoForward: jest.fn(),
  },
  changeShape: jest.fn(),
  selectedElement: null,
  forceFocusSelected: null,
  isTouchUser: true,
  getLaneConfig: (index) => ({
    locked: true,
  }),
  helpers: {
    duration: (start, end) => 0,
    minutesToReadable: (minutes) => "data",
  },
  toggleLockLane: jest.fn(),
  deleteLane: jest.fn(),
  config: {
    defaultColor: "green",
  },
  addLane: jest.fn(),
  setNumberOfLanes: jest.fn(),
};
