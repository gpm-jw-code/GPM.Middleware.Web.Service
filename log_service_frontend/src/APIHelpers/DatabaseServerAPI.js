import axios from 'axios'
import { configs } from '../config'
axios.defaults.baseURL = configs.host

//https://localhost:7005/WeatherForecast
export async function QueryTest() {
  return await GetRequest('/WeatherForecast?id=123')
}

export async function GetEdgeInformation() {
  return await GetRequest('/api/DB/GetEdgeInformation')
}

/**從Server中撈取Database列表 */
export async function GetDatabaseList() {
  return await GetRequest('/api/PostgrelDB/Databases')
}
/**從資料庫中撈取儲存的模組資訊 */
export async function GetModuleInfoStoredInDB() {
  return await GetRequest('/api/Query/ModuleInfos')
}
export async function QueryVibrationEnergy(edgename, ip, startT, endT) {
  return await GetRequest(
    `/api/DB/VibrationEnergy?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}`,
  )
}
export async function QueryHealthScore(edgename, ip, startT, endT) {
  return await GetRequest(
    `/api/DB/HealthScore?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}`,
  )
}
export async function QueryAlertIndex(edgename, ip, startT, endT) {
  return await GetRequest(
    `/api/DB/AlertIndex?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}`,
  )
}

export async function QueryVibration_raw_data(edgename, ip, startT, endT) {
  return await GetRequest(
    `/api/DB/vibration_raw_data?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}`,
  )
}

export async function QueryVibration_raw_data_with_QueryID(
  edgename,
  ip,
  startT,
  endT,
  queryID,
) {
  return await GetRequest(
    `/api/DB/vibration_raw_data_with_QueryID?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&queryID=${queryID}`,
  )
}

export async function QueryPhysical_quantity(edgename, ip, startT, endT) {
  return await GetRequest(
    `/api/DB/Physical_quantity?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}`,
  )
}
export async function QuerySideBandSeverity(edgename, ip, startT, endT) {
  return await GetRequest(
    `/api/DB/SideBandSeverity?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}`,
  )
}

//Frequency_doublingSeverity
export async function QueryFrequency_doublingSeverity(
  edgename,
  ip,
  startT,
  endT,
) {
  return await GetRequest(
    `/api/DB/Frequency_doublingSeverity?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}`,
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
  async HealthScoreOutOfThreshold(edgename, ip, from, to, page = 1) {
    return await GetRequest(
      `/api/DB/DignoseOutOfThreshold?edgename=${edgename}&ip=${ip}&from=${from}&to=${to}&page=${page}`,
    )
  },
  async SideBandSeverityOutOfThres(edgename, ip, from, to, page = 1) {
    return await GetRequest(
      `/api/DB/SideBandSeverityOutOfThres?edgename=${edgename}&ip=${ip}&from=${from}&to=${to}&page=${page}`,
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
