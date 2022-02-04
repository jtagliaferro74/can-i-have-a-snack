import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store.js";
import VueCountdown from "@smithalan2/vue-countdown";

createApp(App).component(VueCountdown.name, VueCountdown).use(store).mount("#app");
