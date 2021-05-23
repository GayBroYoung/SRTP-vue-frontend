import { createApp } from 'vue'
import router from './route/index.js'
import App from './App.vue'
import store from './store';
import './index.css'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

import axios from 'axios'

const app = createApp(App)
app.config.globalProperties.$axios=axios
app.use(ElementPlus).use(router).use(store).mount('#app')
