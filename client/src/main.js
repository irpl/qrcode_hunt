import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import router from "./router";

// import VueQrcodeReader from "vue-qrcode-reader";
// import router from './router'

// createApp(App).use(VueQrcodeReader);
axios.defaults.baseURL = "https://clutch-irpl.vercel.app";
// axios.defaults.baseURL = "http://localhost:5000";
// Vue.config.productionTip = false;

createApp(App).use(router).mount("#app");
