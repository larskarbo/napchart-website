// helper file

import axios from 'axios'

module.exports = {
  save: (data, title, description, cb) => {
    var dataForDatabase = {
      metaInfo: {
      	title,
      	description
      },
      chartData: {
        ...data
      }
    }
    console.log(data)
    axios.post('/api/create', {
        data: JSON.stringify(dataForDatabase)
    })
    .then((response) => {
      console.log(response)
      var chartid = response.data.id
      // window.history.pushState(response.data, '', '/' + chartid)
      cb(chartid)
    })
  },

  loadChart: (loading, loadFinish, cb) => {
    // first check if fetch is needed
    var chartid = window.chartid

    if (!chartid) {
      console.log('no chartid, nothing to load')
      return cb({})
    }
    
    loading()
    axios.get(`/api/get?chartid=${chartid}`, )
    .then(response => {
      var data = {
        ...response.data,
        ...response.data.chartData,
      }
      loadFinish()

      return cb(data)
    })
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