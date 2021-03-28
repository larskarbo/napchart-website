import { ChartData } from "../components/Editor/types"

export const getDataForServer = (data) => {
  const dataForServer: ChartData = {
    elements: data.elements.map((element) => {
      return {
        start: element.start,
        end: element.end,
        lane: element.lane,
        text: element.text,
        color: element.color,
      }
    }),
    colorTags: data.colorTags,
    shape: data.shape,
    lanes: data.lanes,
    lanesConfig: data.lanesConfig,
  }
  return dataForServer
}
