import axios from 'axios'
axios.defaults.baseURL = 'https://localhost:7014/'

export async function GetModuleList() {
  var hres = await axios.get('api/ModuleManager/ModuleList')
  if (hres.status == 200) {
    return hres.data
  } else return []
}

export async function GetAppStates() {
  var hres = await axios.get(`api/AppState/GetAppStates`)
  return hres.data
}

export async function RemoveModule(moduleInfo) {
  var hres = await axios.post(`api/ModuleManager/RemoveModule`, moduleInfo)
  return hres.data
}

export async function AddModule(ip, port) {
  var hres = await axios.post(`api/ModuleManager/AddModule`, {
    ip: ip,
    port: port,
  })
  return hres.data
}

export async function SetMeasureRange(ip = '127.0.0.1', port = 231, range = 2) {
  var hres = await axios
    .post('api/ModuleManager/SettingMeasureRange', {
      Range: range,
      ip: ip,
      port: port,
    })
    .catch((er) => {
      console.info(er)
    })
  return hres.data
}

/**
 * 把tcpclient剔除
 * @param endPoint- client remote endpoint
 * @returns
 */
export async function KickTcpClinetOut(endPoint) {
  var hres = await axios.get(`api/TcpClient/KickOut/${endPoint}`)
  return hres.data
}
