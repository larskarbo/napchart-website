import axios from 'axios'
import { isLocal } from '../components/common/isLocal'

export const BASE = isLocal() ? `http://localhost:3200` : `https://api.napchart.com`
export const WEB_BASE = isLocal() ? `http://localhost:8000` : `https://napchart.com`

let headers = {}

// export function generateHeaders(token) {
//   headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// }

export function request(method, functionName, data?) {
  return axios({
    url: BASE + functionName,
    method: method,
    data: data,
    withCredentials: true,
  }).then((res) => res.data)
  // return ky(BASE + functionName, {
  //   method: method,
  //   json: data,
  //   headers,
  //   credentials: "include",
  //   mode: "cors"
  // }).json()
}
