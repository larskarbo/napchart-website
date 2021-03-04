// In your index.js

require('dotenv').config()
var admin = require('firebase-admin')
const fs = require('fs-extra')
const db = require('../database')

// Initiate Firebase App
// appName is optional, you can omit it.

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://napchart-1abe4.firebaseio.com',
})

const lalalla = async () => {
  // Get a database reference to our posts
  var fbdb = admin.firestore()
  const already = fs.readFileSync('./taken.txt', { encoding: 'utf8' }).split('\n')
  const hey = await fbdb
    .collection('charts')
    .orderBy(admin.firestore.FieldPath.documentId())
    .startAfter(already[already.length - 1])
    .limit(1)
    .get()

  for (const asdf of hey.docs) {
    const val = await asdf.data()
    console.log(asdf.id, 'val: ', val)

    const chartData = {
      elements: val.elements,
      colorTags: val.colorTags,
      shape: val.shape,
      lanes: val.lanes,
      lanesConfig: val.lanesConfig,
    }
    const title = val.title
    const description = val.description

    db.pool
      .query(`INSERT INTO charts (chartid, username, chart_data, title, description) VALUES ($1, $2, $3, $4, $5)`, [
        asdf.id,
        'anonymous',
        chartData,
        title,
        description,
      ])
      .then((hey) => {
        console.log('chartid: ', asdf.id)
        fs.appendFileSync('taken.txt', `\n${asdf.id}`)
        setTimeout(lalalla, 2000)
      })
      .catch((err) => {
        if (err?.constraint == 'users_chartid_key') {
          throw new Error(`Chartid ${asdf.id} already exists`)
        }
        throw new Error(err)
      })
  }
}
lalalla()
