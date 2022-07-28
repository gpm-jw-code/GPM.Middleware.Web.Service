var configs = {
  get host() {
    return process.env.NODE_ENV === 'production'
      ? window.location.protocol + '//' + window.location.host
      : 'https://192.168.0.201:7014'
  },
  get websocket_host() {
    return this.host.replace('http', 'ws')
  },
  get idms_websocket_host() {
    return process.env.NODE_ENV === 'production'
      ? window.location.protocol.replace('http', 'ws') +
          '//' +
          window.location.hostname +
          ':44332'
      : 'ws://192.168.0.201:44332'
  },
}
console.info(
  window.location.protocol.replace('http', 'ws') +
    '//' +
    window.location.hostname +
    ':44332',
)
console.info(configs.host)
console.info('websocket_host', configs.websocket_host)
console.info('idms_websocket_host', configs.idms_websocket_host)
export { configs }