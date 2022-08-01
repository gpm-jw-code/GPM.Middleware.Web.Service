import { configs } from '@/config'
const ws_host = configs.idms_websocket_host

export async function GetModuleInfos() {
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${ws_host}/ModuleInfoGet`)
    ws.onopen = () => ws.send('GetInfos')
    ws.onmessage = (evt) => {
      ws.close()
      resolve(JSON.parse(evt.data))
    }
    ws.onerror = (er) => reject(er)
  })
}

export async function GetDignoseDataListWsInstance() {
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${ws_host}/Dignose?type=list`)
    ws.onopen = () => resolve(ws)
    ws.onerror = (er) => reject(er)
  })
}
export async function GetTrendchartWsInstance(ip) {
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${ws_host}/Dignose?type=chart&number=90&ip=${ip}`)
    ws.onopen = () => resolve(ws)
    ws.onerror = () => reject(null)
  })
}
/**取得模型列表 */
export async function GetModelList(ip = 'ip') {
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${ws_host}/Diagnose/ModelInfo?StatesMonitor=FALSE`)
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

export async function GetDignoseThresholdVal(ip) {
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(
      `${configs.idms_websocket_host}/Settings?Get=DignoseThresholds&IP=${ip}`,
    )
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
export async function SetDignoseWarningThreshold(ip, threshold) {
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(
      `${ws_host}/Settings?IP=${ip}&DignoseWarningThres=${threshold}`,
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
export async function SetDignoseAlarmThreshold(ip, threshold) {
  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(
      `${ws_host}/Settings?IP=${ip}&DignoseAlarmThres=${threshold}`,
    )
    ws.onmessage = (evt) => {
      ws.close()
      resolve(JSON.parse(evt.data))
    }
    ws.onerror = (er) => reject(er)
  })
}

export async function SetModelEnable(ip, modelName, enabled) {
  // public string Action { get; set; }
  // public string IP { get; set; }
  // public string Model_Name { get; set; }

  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${ws_host}/Diagnose/ModelInfo`)
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

export async function DeleteModel(ip, modelName) {
  // public string Action { get; set; }
  // public string IP { get; set; }
  // public string Model_Name { get; set; }

  return await new Promise((resolve, reject) => {
    var ws = new WebSocket(`${ws_host}/Diagnose/ModelInfo`)
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
