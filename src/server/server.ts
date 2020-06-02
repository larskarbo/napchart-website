export interface Server {
  save: (data: any, title: string, description: string, db: any) => void
  loadChart: (loading: any, loadFinish: any, ab: any) => void
  sendFeedback: (feedback: any, cb: any) => void
  addEmailToFeedback: (email: any, feedbackId: any, cb: any) => void
}
