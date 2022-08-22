import { configs } from '@/config'
const ws_host = configs.idms_websocket_host

export async function GetModuleInfos(edgeIP) {
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${configs.websocket_host}/ModuleInfoGet?edgeIP=${edgeIP}`)
    ws.onopen = () => ws.send('GetInfos')
    ws.onmessage = (evt) => {
      ws.close()
      resolve(JSON.parse(evt.data))
    }
    ws.onerror = (er) => reject(er)
  })
}

export async function GetDignoseDataListWsInstance(edgeIP) {
  return await new Promise((resolve, reject) => {
    var host = configs.websocket_host;
    console.info('GetDignoseDataListWsInstance', edgeIP)
    var ws = new WebSocket(`${host}/Dignose?type=list&edgeIP=${edgeIP}`)
    ws.onopen = () => resolve(ws)
    ws.onerror = (er) => reject(er)
  })
}
export async function GetTrendchartWsInstance(edgeIP, sensorIP, featureType = 'HS') {
  var host = configs.websocket_host;
  console.info('GetTrendchartWsInstance', edgeIP)
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(
      `${host}/Dignose?edgeIP=${edgeIP}&type=chart&number=90&sensorIP=${sensorIP}&chart_type=${featureType}`,
    )
    ws.onopen = () => resolve(ws)
    ws.onerror = () => reject(null)
  })
}
/**取得模型列表 */
export async function GetModelList(edgeIP, ip = 'ip') {
  var host = edgeIP == undefined ? ws_host : `ws://${edgeIP}:44332`
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${host}/Diagnose/ModelInfo?StatesMonitor=FALSE`)
    ws.onopen = () => {
      ws.send(`GIVEMEINFO,${ip}`)
    }
    ws.onmessage = (evt) => {
      const ret = JSON.parse(evt.data)
      var EQ = ret.EQ
      var UNIT = ret.UNIT
      var modelData = ret.modelData
      ws.close()
      resolve({ EQ: EQ, UNIT: UNIT, modelData: modelData })
    }
    ws.onerror = (er) => {
      reject(er)
    }
  })
}

export async function GetDignoseThresholdVal(edgeIP, ip) {
  var host = edgeIP == undefined ? ws_host : `ws://${edgeIP}:44332`
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${host}/Settings?Get=DignoseThresholds&IP=${ip}`)
    ws.onmessage = (evt) => {
      var ret = JSON.parse(evt.data)
      ws.close()
      resolve(ret)
    }
    ws.onerror = (er) => reject(er)
  })
}

/** SET */

/**設定診斷Warning閥值
 * @Parm ip = 模組IP
 * @Parm threshold = 設定值
 */
export async function SetDignoseWarningThreshold(edgeIP, ip, threshold) {
  var host = edgeIP == undefined ? ws_host : `ws://${edgeIP}:44332`
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(
      `${host}/Settings?IP=${ip}&DignoseWarningThres=${threshold}`,
    )
    ws.onmessage = (evt) => {
      ws.close()
      resolve(JSON.parse(evt.data))
    }
    ws.onerror = (er) => reject(er)
  })
}

/**設定診斷Alarm閥值
 * @Parm ip = 模組IP
 * @Parm threshold = 設定值
 */
export async function SetDignoseAlarmThreshold(edgeIP, ip, threshold) {
  var host = edgeIP == undefined ? ws_host : `ws://${edgeIP}:44332`
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(
      `${host}/Settings?IP=${ip}&DignoseAlarmThres=${threshold}`,
    )
    ws.onmessage = (evt) => {
      ws.close()
      resolve(JSON.parse(evt.data))
    }
    ws.onerror = (er) => reject(er)
  })
}

export async function SetModelEnable(edgeIP, ip, modelName, enabled) {
  // public string Action { get; set; }
  // public string IP { get; set; }
  // public string Model_Name { get; set; }
  var host = edgeIP == undefined ? ws_host : `ws://${edgeIP}:44332`
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${host}/Diagnose/ModelInfo`)
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          Action: enabled ? 'Enable' : 'Disable',
          IP: ip,
          Model_Name: modelName,
        }),
      )
    }
    ws.onmessage = (evt) => {
      ws.close()
      resolve(JSON.parse(evt.data))
    }
    ws.onerror = (er) => reject(er)
  })
}

export async function DeleteModel(edgeIP, ip, modelName) {
  // public string Action { get; set; }
  // public string IP { get; set; }
  // public string Model_Name { get; set; }
  var host = edgeIP == undefined ? ws_host : `ws://${edgeIP}:44332`

  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${host}/Diagnose/ModelInfo`)
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          Action: 'Delete',
          IP: ip,
          Model_Name: modelName,
        }),
      )
    }
    ws.onmessage = (evt) => {
      ws.close()
      resolve(JSON.parse(evt.data))
    }
    ws.onerror = (er) => reject(er)
  })
}
