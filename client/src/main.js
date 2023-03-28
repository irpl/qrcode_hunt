import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

import VueQrcodeReader from "vue-qrcode-reader";

Vue.use(VueQrcodeReader);
// axios.defaults.baseURL = "https://clutch-irpl.vercel.app";
axios.defaults.baseURL = "http://localhost:5000";
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
