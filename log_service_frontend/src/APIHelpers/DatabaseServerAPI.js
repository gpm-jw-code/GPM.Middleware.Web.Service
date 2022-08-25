import axios from 'axios'
import { configs } from '../config'
axios.defaults.baseURL = configs.host

/**取得版本號資訊 */
export async function GetWebSiteVersion() {
  return await GetRequest('/api/Version/WebsiteVersion')
}

/**取得Release Note */
export async function GetReleaseNoteMD(){
    var res = await axios.get('/api/version/releasenote').catch(er=>{
        return '';
    });
    console.info(res);
    return res.data;
}


export async function GetEdgeInformation() {
  return await GetRequest('/api/DB/GetEdgeInformation')
}

/**從Server中撈取Database列表 */
export async function GetDatabaseList() {
  return await GetRequest('/api/PostgrelDB/Databases')
}
/**從資料庫中撈取儲存的模組資訊 */
export async function GetModuleInfoStoredInDB(edgename) {
  return await GetRequest(`/api/Query/ModuleInfos?dbName=${edgename}`)
}
export async function QueryVibrationEnergy(edgename, ip, startT, endT, chart_pixel,customSetting) {
  return await GetRequest(
    `/api/DB/VibrationEnergy?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&chart_pixel=${chart_pixel}&customSettingJson=${customSetting}`,
  )
}
export async function QueryHealthScore(edgename, ip, startT, endT,chart_pixel,customSetting) {
  return await GetRequest(
    `/api/DB/HealthScore?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&chart_pixel=${chart_pixel}&customSettingJson=${customSetting}`,
  )
}
export async function QueryAlertIndex(edgename, ip, startT, endT, chart_pixel,customSetting) {
  return await GetRequest(
    `/api/DB/AlertIndex?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&chart_pixel=${chart_pixel}&customSettingJson=${customSetting}`,
  )
}

export async function QueryVibration_raw_data(edgename, ip, startT, endT, chart_pixel,customSetting) {
  return await GetRequest(
    `/api/DB/vibration_raw_data?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&chart_pixel=${chart_pixel}&customSettingJson=${customSetting}`,
  )
}

export async function QueryVibration_raw_data_with_QueryID(
  edgename,
  ip,
  startT,
  endT,
  queryID, chart_pixel,customSetting
) {
  return await GetRequest(
    `/api/DB/vibration_raw_data_with_QueryID?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&queryID=${queryID}&chart_pixel=${chart_pixel}&customSettingJson=${customSetting}`,
  )
}

export async function QueryPhysical_quantity(edgename, ip, startT, endT, chart_pixel,customSetting) {
  return await GetRequest(
    `/api/DB/Physical_quantity?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&chart_pixel=${chart_pixel}&customSettingJson=${customSetting}`,
  )
}
export async function QuerySideBandSeverity(edgename, ip, startT, endT, chart_pixel,customSetting) {
  return await GetRequest(
    `/api/DB/SideBandSeverity?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&chart_pixel=${chart_pixel}&customSettingJson=${customSetting}`,
  )
}

//Frequency_doublingSeverity
export async function QueryFrequency_doublingSeverity(
  edgename,
  ip,
  startT,
  endT, chart_pixel,customSetting
) {
  return await GetRequest(
    `/api/DB/Frequency_doublingSeverity?edgename=${edgename}&ip=${ip}&from=${startT}&to=${endT}&chart_pixel=${chart_pixel}&customSettingJson=${customSetting}`,
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

/**取得Edge端Websocket數據接收狀態 */
export async function GetEdgeWSDataRevState(withData=false){
  return await GetRequest('/api/edge/EdgesWSDataState');
}


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
