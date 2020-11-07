import { DocumentData, DocumentReference } from '@firebase/firestore-types'
import { NapChartData } from '../components/Editor/napchart'
import { ChartData } from './ChartData'
export interface Server {
  saveNew: (data: NapChartData) => Promise<string>
  update: (data: NapChartData, chartid: string) => Promise<string>
  loadChart: (chartid: string) => Promise<ChartData>
  sendFeedback: (feedback: string) => Promise<DocumentReference<DocumentData>>
  addEmailToFeedback: (email: any, feedbackId: any) => Promise<any>
  loadChartsForUser: (userId: number) => Promise<any>
}
