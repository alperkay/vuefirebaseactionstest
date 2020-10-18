import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import drawable from "@/directives/Draw.ts";

const app = createApp(App);

app.directive("drawable", drawable);

app
  .use(store)
  .use(router)
  .mount("#app");
