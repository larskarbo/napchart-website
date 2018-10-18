







// NOT IN USE rn






import axios from 'axios'
import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDTg18EW6Qu52hgqJhAhn_bQsKl5XKaMG8",
  authDomain: "napchart-v8.firebaseapp.com",
  databaseURL: "https://napchart-v8.firebaseio.com",
  projectId: "napchart-v8",
  storageBucket: "napchart-v8.appspot.com",
  messagingSenderId: "518752038140"
};

// Get a reference to the database service

function idgen() {
  const alphabet = 'abcdefghijklmnopqrstuwxyz0123456789'
  let id = ''
  for (var i = 0; i < 5; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return id
}

export default {
  begin: () => {
    // firebase.initializeApp(config)
  },
  save: (data, title, description, cb) => {
    var database = firebase.database();
    
    const chartid = idgen()
    firebase.database().ref('charts').child(chartid).set({
      metaInfo: {
        title,
        description
      },
      chartData: {
        ...data
      }
    })
      .then((response) => {
        console.log(response)
        // var chartid = response.data.id
        
        cb(null, chartid)
      })
      .catch((hm) => {
        console.error('oh no!:', hm)
        cb('Oh no! There was an error with your request. Please try again')
      })
  },

  loadChart: (loading, loadFinish, cb) => {
    // first check if fetch is needed
    const locString = window.location.toString().split('/')
    var chartid = locString[locString.length - 1]

    if (!chartid || chartid.length < 6) {
      console.log('no chartid, nothing to load')
      return cb({})
    }

    var database = firebase.database();

    loading()
    firebase.database().ref('/charts/' + chartid).once('value').then(function (snapshot) {
      const response = snapshot.val()
      var data = {
        ...response,
        ...response.chartData,
      }
      delete data.chartData
      loadFinish()

      return cb(data)
      
    }).catch(function (asdf) {
      console.log('bad', asdf)
    })

    // axios.get(`/api/get?chartid=${chartid}`, )
    //   .then(response => {
        //   ...response.data,
        //   ...response.data.chartData,
        // }
        // delete data.chartData
        // loadFinish()

        // return cb(data)
    //   })
  },

  sendFeedback: (feedback, cb) => {
    axios.post('/api/postFeedback', {
        data: JSON.stringify(feedback)
      })
      .then((response) => {
        console.log(response)
        cb()
      })
  }
}