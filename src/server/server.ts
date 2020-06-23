import { DocumentData, DocumentReference } from '@firebase/firestore-types'
import { NapChartData } from '../components/Editor/napchart'
import { ChartData } from './chart_data'
export interface Server {
  save: (data: NapChartData, title: string, description: string) => Promise<DocumentReference<DocumentData> | void>
  loadChart: (chartid: string) => Promise<ChartData>
  sendFeedback: (feedback: any) => void
  addEmailToFeedback: (email: any, feedbackId: any) => void
  loadChartsForUser: (userId: number) => Promise<any>
}
