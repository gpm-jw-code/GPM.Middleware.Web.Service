var configs = {
  get host() {
    return process.env.NODE_ENV === 'production'
      ? window.location.protocol + '//' + window.location.host
      : 'https://127.0.0.1:443'
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
      : 'ws://127.0.0.1:44332'
  },
  // mode: process.env.NODE_ENV === 'production' ? 'gpm' : 'dev',
  mode: 'gpm',
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
