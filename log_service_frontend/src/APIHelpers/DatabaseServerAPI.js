import axios from 'axios'
import { configs } from '../config'
axios.defaults.baseURL = configs.host

//https://localhost:7005/WeatherForecast
export async function QueryTest() {
  return await GetRequest('/WeatherForecast?id=123')
}

/**從Server中撈取Database列表 */
export async function GetDatabaseList() {
  return await GetRequest('/api/PostgrelDB/Databases')
}
/**從資料庫中撈取儲存的模組資訊 */
export async function GetModuleInfoStoredInDB() {
  return await GetRequest('/api/Query/ModuleInfos')
}
export async function QueryVibrationEnergy(ip, startT, endT) {
  return await GetRequest(
    `/api/DB/VibrationEnergy?ip=${ip}&from=${startT}&to=${endT}`,
  )
}
export async function QueryHealthScore(ip, startT, endT) {
  return await GetRequest(
    `/api/DB/HealthScore?ip=${ip}&from=${startT}&to=${endT}`,
  )
}
export async function QueryAlertIndex(ip, startT, endT) {
  return await GetRequest(
    `/api/DB/AlertIndex?ip=${ip}&from=${startT}&to=${endT}`,
  )
}

export async function QueryVibration_raw_data(ip, startT, endT) {
  return await GetRequest(
    `/api/DB/vibration_raw_data?ip=${ip}&from=${startT}&to=${endT}`,
  )
}

export async function QueryPhysical_quantity(ip, startT, endT) {
  return await GetRequest(
    `/api/DB/Physical_quantity?ip=${ip}&from=${startT}&to=${endT}`,
  )
}
export async function QuerySideBandSeverity(ip, startT, endT) {
  return await GetRequest(
    `/api/DB/SideBandSeverity?ip=${ip}&from=${startT}&to=${endT}`,
  )
}

//Frequency_doublingSeverity
export async function QueryFrequency_doublingSeverity(ip, startT, endT) {
  return await GetRequest(
    `/api/DB/Frequency_doublingSeverity?ip=${ip}&from=${startT}&to=${endT}`,
  )
}

/**根據querID 查詢切片資料 */
export async function QuerySplice(queryID, from, to) {
  return await GetRequest(
    `/api/DB/GetSplice?queryID=${queryID}&from=${from}&to=${to}`,
  )
}

/**事件查詢 */
export const EventQuery = {
  async HealthScoreOutOfThreshold(ip, from, to, page = 1) {
    return await GetRequest(
      `/api/DB/DignoseOutOfThreshold?ip=${ip}&from=${from}&to=${to}&page=${page}`,
    )
  },
  async SideBandSeverityOutOfThres(ip, from, to, page = 1) {
    return await GetRequest(
      `/api/DB/SideBandSeverityOutOfThres?ip=${ip}&from=${from}&to=${to}&page=${page}`,
    )
  },
  //SideBandSeverityOutOfThres
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
