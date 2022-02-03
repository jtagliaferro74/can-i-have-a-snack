import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store.js";
// import vueAwesomeCountdown from "vue-awesome-countdown";
// import VueCountdown from "@chenfengyuan/vue-countdown";
import VueCountdown from "@smithalan2/vue-countdown";
// import VueConfetti from "vue-confetti";

createApp(App).component(VueCountdown.name, VueCountdown).use(store).mount("#app");
