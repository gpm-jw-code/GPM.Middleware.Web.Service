import ModelTrainer from './ModelTrainer.vue'
var methods = {
  Show() {
    ModelTrainer.methods.ShowUp()
  },
}
const Plugin = (app, options = {}) => {
  app.$modelTrainer = methods
  app.config.globalProperties.$modelTrainer = methods
}

ModelTrainer.install = Plugin

export default ModelTrainer
export { ModelTrainer, methods }
