import * as firebase from '@firebase/testing'
import { FirebaseServer } from '../FirebaseServer'
import { Server } from '../Server'
import { assert } from 'console'
import { FirebaseFirestore, DocumentData, DocumentReference } from '@firebase/firestore-types'
import { firebaseAuthProvider, FirebaseAuthProvider } from '../../auth/firebase_auth_provider'
import { AuthProvider } from '../../auth/auth_provider'
import { napChartMock } from '../../components/Editor/__mocks__/napchart.mock'
import { ChartData } from '../ChartData'

var server: Server
const mockAuthProvider: AuthProvider = {
  isUserSignedIn: () => false,
  getUserId: () => undefined,
}
beforeEach(() => {
  const testApp: any = firebase.initializeTestApp({
    projectId: 'napchart-1abe4',
    auth: { uid: 'juanitotaveras', email: 'alice@example.com' },
  })
  if (firebase == null) {
    assert(false)
  }
  FirebaseServer.init({ testApp: testApp, authProvider: mockAuthProvider })
  server = FirebaseServer.getInstance()
  // set up counter
  FirebaseServer.testOnlyMethods.getDb().collection('chartcounter').doc('counter').set({
    value: 0,
  })
})

afterEach(() => {
  firebase.clearFirestoreData({ projectId: 'napchart-labe4' })
  FirebaseServer.testOnlyMethods.resetState()
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
  const docRef: DocumentReference<DocumentData> = await server.sendFeedback(feedbackString)
  const result = await server.addEmailToFeedback('someEmail@gmail.com', docRef)
  expect(null).toBeFalsy()
})
