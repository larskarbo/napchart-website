const db = require('../database')

var firebase = require('firebase/app')

// Add the Firebase products that you want to use
// require("firebase/auth");
require('firebase/firestore')

const firebaseConfig = {
  apiKey: 'AIzaSyDZIH0Vogv07ZWCUMwPn1gaBaF_6rAP_zg',
  authDomain: 'napchart-1abe4.firebaseapp.com',
  databaseURL: 'https://napchart-1abe4.firebaseio.com',
  projectId: 'napchart-1abe4',
  storageBucket: 'napchart-1abe4.appspot.com',
  messagingSenderId: '747326670843',
  appId: '1:747326670843:web:39891acdbdf5df1cd8ed5e',
  measurementId: 'G-NP62410MLV',
}
firebase.initializeApp(firebaseConfig)

const getChart = async function (req, res) {
  const { chartid } = req.params

  db.pool.query('SELECT * FROM charts WHERE chartid = $1', [chartid], (error, results) => {
    console.log('results: ', results.rows)
    if (error) {
      throw error
    }
    if (results.rows.length == 0) {
      return firebaseGet(res, chartid)

      return res.status(404).send({
        status: 'not found',
      })
    }

    const chart = results.rows[0]
    return res.send({
      chartData: chart.chart_data,
      chartid: chart.chartid,
      title: chart.title,
      description: chart.description,
    })
  })
}

const firebaseGet = async (res, chartid) => {
  var db = firebase.firestore()

  return await db
    .collection('charts')
    .doc(chartid)
    .get()
    .then((snapshot) => {
      const result = snapshot.data()
      if (result === undefined) {
        res.status(404).send('Chart with ID ' + chartid + ' not found.')
        return
      }
      // want it to be the same as previous version
      res.send({
        chartData: {
          elements: result.elements,
          colorTags: result.colorTags,
          shape: result.shape,
          lanes: result.lanes,
          lanesConfig: result.lanesConfig,
        },
        chartid: chartid,
        title: result.title,
        description: result.description,
      })
    })
}

exports.getChart = getChart
