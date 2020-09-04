import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueQrcodeReader)
axios.defaults.baseURL = 'https://clutch-api.philliplogan.com' 
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
