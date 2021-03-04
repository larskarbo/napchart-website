import axios from 'axios'

const isLocal = typeof location != 'undefined' && location?.host?.includes('localhost')
export const BASE = isLocal ? `http://localhost:3200` : `https://api.napchart.com`

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
