// helper file

import axios from 'axios'
import firebase from 'firebase'

// Initialize Firebase



// Get a reference to the database service
// var database = firebase.database();

function idgen() {
  const alphabet = 'abcdefghijklmnopqrstuwxyz0123456789'
  let id = ''
  for (var i = 0; i < 5; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return id
}

export default {
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
    var chartid = 'fuckboy'

    // if (!chartid) {
    //   console.log('no chartid, nothing to load')
    //   return cb({})
    // }

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
      
    });

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