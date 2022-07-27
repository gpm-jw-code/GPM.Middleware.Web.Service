var configs = {
  get host() {
    return process.env.NODE_ENV === 'production'
      ? window.location.protocol + '//' + window.location.host
      : 'https://localhost:7014'
  },
  get websocket_host() {
    return this.host.replace('http', 'ws')
  },
}
console.info(configs.host)
console.info(configs.websocket_host)
export { configs }
