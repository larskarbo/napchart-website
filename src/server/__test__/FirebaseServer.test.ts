import * as firebase from '@firebase/testing'
import { FirebaseServer } from '../FirebaseServer'
import { Server } from '../Server'
import { assert } from 'console'
import { FirebaseFirestore, DocumentData, DocumentReference } from '@firebase/firestore-types'
import { firebaseAuthProvider, FirebaseAuthProvider } from '../../auth/firebase_auth_provider'
import { AuthProvider } from '../../auth/auth_provider'
import { napChartMock } from '../../components/Editor/__mocks__/napchart.mock'
import { ChartData } from '../ChartData'

const mockAuthProvider: AuthProvider = {
  isUserSignedIn: () => false,
  getUserId: () => undefined,
}
const testApp: any = firebase.initializeTestApp({
  projectId: 'napchart-1abe4',
  auth: { uid: 'juanitotaveras', email: 'alice@example.com' },
})
FirebaseServer.init({ testApp: testApp, authProvider: mockAuthProvider })
const server = FirebaseServer.getInstance()

afterEach(() => {
  firebase.clearFirestoreData({ projectId: 'napchart-1abe4' })
})

test('Save should return chart ID. Load chart should load chart successfully.', async () => {
  const chartid = await server.save(napChartMock.data, 'testTitle', 'testDescription')
  const chart: ChartData = await server.loadChart(chartid)
  expect(chart.chartid).toBe(chartid)
  expect(chart.title).toBe('testTitle')
})

test('If chart ID is not found, promise should be rejected.', async () => {
  const error = await server.loadChart('some fake id').catch((err) => err)
  expect(error).toBe('Chart with ID some fake id not found.')
})

test('Send feedback', async () => {
  const feedbackString = 'This is some feedback.'
  const docRef: DocumentReference<DocumentData> = await server.sendFeedback(feedbackString)
  const loadedDoc = await docRef.get().then((snapshot) => snapshot.data())
  expect({ feedback: feedbackString }).toEqual(loadedDoc)
})

test('Attach email to feedback', async () => {
  const feedbackString = 'This is some feedback.'
  const email: String = 'someEmail@gmail.com'
  const docRef: DocumentReference<DocumentData> = await server.sendFeedback(feedbackString)
  await server.addEmailToFeedback(email, docRef)
  const loadedDoc = await docRef.get().then((snapshot) => snapshot.data())
  expect({ feedback: feedbackString, email }).toEqual(loadedDoc)
})
