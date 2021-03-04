// In your index.js

const fs = require('fs')
const { backup, backups, initializeApp } = require('firestore-export-import')
const serviceAccount = require('./serviceAccountKey.json')

// Initiate Firebase App
// appName is optional, you can omit it.
initializeApp(serviceAccount)

const queryByName = (collectionRef) =>
  collectionRef.where('feedback', '==', 'Putting the legend on a side if too big :) ').get()

const options = {
  docsFromEachCollection: 10, // limit number of documents when exporting
  //   queryCollection: queryByName
}

// Start exporting your data
backup('feedback/001y2', options).then((data) => {
  fs.writeFileSync('./out.json', JSON.stringify(data))
})
