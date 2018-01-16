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
      window.history.pushState(response.data, '', '/' + chartid)
      cb(chartid)
    })
  },

  loadChart: (loading, loadFinish, cb) => {
    // first check if fetch is needed
    var url = window.location.href

    if (url.split('/')[3].length == 0) {
      return cb({})
    } else {
      var splitted = url.split('/')
      var chartid = splitted[splitted.length - 1]
    }
    console.log(chartid)
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