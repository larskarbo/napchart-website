import { DocumentData, DocumentReference } from '@firebase/firestore-types'
import { NapChartData } from '../components/Editor/napchart'
import { ChartData } from './ChartData'
export interface Server {
  save: (data: NapChartData, title: string, description: string) => Promise<string>
  loadChart: (chartid: string) => Promise<ChartData>
  sendFeedback: (feedback: string) => Promise<DocumentReference<DocumentData>>
  addEmailToFeedback: (email: any, feedbackId: any) => Promise<any>
  loadChartsForUser: (userId: number) => Promise<any>
}
