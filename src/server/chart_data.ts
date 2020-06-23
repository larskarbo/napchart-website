import { NapChartData } from "../components/Editor/napchart";

/**
 * This is the object that get stored for a chart
 * in Firebase.
 */
export class ChartData {
  chartid: string;
  title: string;
  description: string;
  data: NapChartData;
  constructor(
    chartid: string,
    title: string,
    description: string,
    data: NapChartData
  ) {
    this.chartid = chartid;
    this.title = title;
    this.description = description;
    this.data = data;
  }
}
