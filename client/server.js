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
        
        cb(null, chartid)
      })
      .catch((hm) => {
        console.error('oh no!:', hm)
        cb('Oh no! There was an error with your request. Please try again')
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
        delete data.chartData
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
  },

  signup: (data, cb) => {
    console.log(data)
    fetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then((hm) => {
        console.log(hm)
        if (typeof hm.errmsg != 'undefined') {
          return cb(hm.errmsg)
        } else {
          return cb(null, hm)
        }
      })
      .catch((err) => {
        return cb(err.message)
      })
  },

  userAvailable: (key, value, cb) => {
    fetch('/auth/available/' + key, {
        method: 'POST',
        body: JSON.stringify({
          [key]: value
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then((response) => {
        console.log(response)
        if (response.status == 200) {
          return response.json()
        } else {
          return response.text()
        }
      })
      .then((text) => {
        if (typeof text == 'string') {
          //error
          console.log('err:', text)
          cb(text)
        } else {
          //javascript object
          cb(null, text)
        }
      })
  },

  login: (data, cb) => {
    fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        credentials: 'same-origin'
      })
      .then((response) => {
        return response.json()
      })
      .then((hm) => {
        if (typeof hm.errmsg != 'undefined') {
          return cb(hm.errmsg)
        } else {
          return cb(null, hm)
        }
      })
      .catch((err) => {
        return cb(err.message)
      })
  },
}