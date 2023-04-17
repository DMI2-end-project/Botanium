import './style.css';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import router from "./router";
import App from './App.vue';
import {useStore} from "./stores/main";
import {initClient} from "./client";
import {registerLayouts} from './layouts/register';


const app = createApp(App);
// app.config.globalProperties.$pocketBaseUrl = "https://pocketbase-dmi2.fly.dev/" as string
app.provide('pocketBaseUrl', "https://pocketbase-dmi2.fly.dev/")

export const pinia = createPinia();
app.use(pinia);
initClient();
DatabaseManagerInstance.pb;
const store = useStore();

async function fetch() {
  await store.fetchRoles();
}
fetch();

app.use(router);

registerLayouts(app);

app.mount('#app');
