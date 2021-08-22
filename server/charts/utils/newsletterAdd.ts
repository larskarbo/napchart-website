import { getEnv } from '@larskarbo/get-env';
import axios from 'axios'
import { slackNotify } from './slackNotify';

var FormData = require("form-data");

export const newsletterAdd = async (email: string, list: string) => {
  var data = new FormData()
  data.append('api_key', getEnv("SENDY_API"))
  data.append('email', email)
  data.append('list', list)


  await axios({
    method: 'post',
    url: getEnv("SENDY_URL"),
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  })
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error.message)
      slackNotify(`Newsletter add failed for new user: ${email}. List ${list}.`)
      return error
    })
}
