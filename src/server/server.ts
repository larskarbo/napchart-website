import { DocumentData, DocumentReference } from "@firebase/firestore-types";
import { NapChartData } from "../components/Editor/napchart";
export interface Server {
  save: (
    data: any,
    title: string,
    description: string
  ) => Promise<DocumentReference<DocumentData>>;
  loadChart: () => Promise<NapChartData | void>;
  sendFeedback: (feedback: any, cb: any) => void;
  addEmailToFeedback: (email: any, feedbackId: any, cb: any) => void;
  loadChartsForUser: (userId: number) => Promise<any>;
}
