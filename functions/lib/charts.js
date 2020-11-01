'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.saveNewChart = exports.updateChart = void 0
const functions = require('firebase-functions')
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin')
admin.initializeApp()
const cors = require('cors')({
  origin: true,
})

// FUNCTIONS (endpoints) ↓
exports.updateChart = functions.https.onRequest((req, res) =>
  cors(req, res, async () => {
    const { chartid, data } = req.body.data
    const dataForServer = createChartObjectForServer(data)
    admin
      .firestore()
      .collection('charts')
      .doc(chartid)
      .set(dataForServer)
      .then(() => {
        res.json({ result: { chartid: chartid } })
      })
  }),
)

exports.saveNewChart = functions.https.onRequest((req, res) =>
  cors(req, res, async () => {
    const { data } = req.body.data
    const dataForServer = createChartObjectForServer(data)
    return getUniqueChartId().then((chartid) => {
      console.error('generated unique id')
      console.error(chartid)
      return admin
        .firestore()
        .collection('charts')
        .doc(chartid)
        .set(dataForServer)
        .then(() => {
          res.json({ result: { chartid: chartid } })
        })
    })
  }),
)
// UTILS ↓
const createChartObjectForServer = (data) => {
  const output = {
    title: data.title,
    description: data.description,
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
  return output
}
const generateRandomId = () => {
  const alphabet = 'abcdefghijklmnopqrstuwxyz0123456789'
  let id = ''
  for (var i = 0; i < 5; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return id
}
const getUniqueChartId = async () => {
  let id = generateRandomId()
  while (await isIdAlreadyTaken(id)) {
    id = generateRandomId()
  }
  return id
}
const isIdAlreadyTaken = (id) => {
  return admin
    .firestore()
    .collection('charts')
    .doc(id)
    .get()
    .then((doc) => {
      return doc.exists
    })
}
//# sourceMappingURL=charts.js.map
