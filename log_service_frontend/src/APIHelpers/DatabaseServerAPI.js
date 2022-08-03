import axios from 'axios'
import { configs } from '../config'
axios.defaults.baseURL = configs.host

//https://localhost:7005/WeatherForecast
export async function QueryTest() {
  return await GetRequest('/WeatherForecast?id=123')
}

export async function QueryHealthScore(ip, startT, endT) {
  return await GetRequest(
    `/api/Query/HealthScore?ip=${ip}&from=${startT}&to=${endT}`,
  )
}
export async function QueryAlertIndex(ip, startT, endT) {
  return await GetRequest(
    `/api/Query/AlertIndex?ip=${ip}&from=${startT}&to=${endT}`,
  )
}
// async function PostRequest(api = '', data = {}) {
//   return new Promise((resolve) => {
//     axios
//       .post(api, data)
//       .catch((e) => {
//         resolve(e.message)
//       })
//       .then((res) => {
//         resolve(res.data)
//       })
//   })
// }

async function GetRequest(api = '') {
  return new Promise((resolve) => {
    axios
      .get(api)
      .catch((e) => {
        console.info(e)
        resolve({
          message: e.message,
        })
      })
      .then((res) => {
        resolve(res.data)
      })
  })
}
