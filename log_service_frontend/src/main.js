import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import countTo from 'vue3-count-to';

const app = createApp(App)
app.use(router)
app.use(BootstrapVue3)
app.use(countTo)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.mount('#app')
