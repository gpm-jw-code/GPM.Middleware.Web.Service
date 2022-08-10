import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import countTo from 'vue3-count-to'
import { configs } from './config'
import Toaster from '@meforma/vue-toaster'
import '@/styles/animations.css'

const app = createApp(App)
app.use(configs)
app.use(router)
app.use(BootstrapVue3)
app.use(countTo)
app.use(Toaster)

app.use(ElementPlus, { size: 'default', zIndex: 3000 })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
