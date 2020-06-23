import * as firebase from '@firebase/testing'
import { FirebaseServer } from '../firebase_server'
import { Server } from '../server'
import { assert } from 'console'
import { FirebaseFirestore } from '@firebase/firestore-types'
import { firebaseAuthProvider, FirebaseAuthProvider } from '../../auth/firebase_auth_provider'
import { AuthProvider } from '../../auth/auth_provider'
import { napChartMock } from '../../components/Editor/__mocks__/napchart.mock'
import { ChartData } from '../chart_data'

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
  FirebaseServer.testOnlyMethods
    .getDb()
    .collection('chartcounter')
    .doc('counter')
    .set({
      value: 0,
    })
    .catch((err) => console.error(err))
})

afterEach(() => {
  FirebaseServer.testOnlyMethods.resetState()
})

test('Updates counter after saving new schedule', async () => {
  await server.save(napChartMock.data, 'testTitle', 'testDescription')
  const newID = await FirebaseServer.getUniqueChartId()
  expect(newID).toBe('2')
})

test('Load chart given a chart ID.', async () => {
  await server.save(napChartMock.data, 'testTitle', 'testDescription')
  const chart: ChartData = await server.loadChart('1')
  expect(chart.chartid).toBe('1')
  expect(chart.title).toBe('testTitle')
})
