import './style.css';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {initClient} from "./client";
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import router from "./router";
import App from './App.vue';
import {useMainStore} from "./stores/mainStore";
import {registerLayouts} from './layouts/register';

const app = createApp(App);

app.provide('pocketBaseUrl', "https://pocketbase-dmi2.fly.dev/")

export const pinia = createPinia();
app.use(pinia);
initClient(pinia);
DatabaseManagerInstance.pb;

const store = useMainStore();
store.roles = await DatabaseManagerInstance.fetchRoles();

app.use(router);

registerLayouts(app);

app.mount('#app');
