import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import HighchartsVue from 'highcharts-vue'
import './plugins/highcharts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
    .use(router)
    .use(HighchartsVue, { tagName: 'charts'})

app.mount('#app')