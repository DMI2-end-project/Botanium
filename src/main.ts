import './style.css';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {initClient} from "./client";
import { DatabaseManagerInstance } from "./common/DatabaseManager";
import { mountGameMasterManagerInstance } from "./common/GameMasterManager";
import { ROLE } from "./common/Constants";
import { mountTeamManagerInstance } from "./common/TeamManager";
import router from "./router";
import App from './App.vue';
import {useMainStore} from "./stores/mainStore";

const app = createApp(App);

app.provide('pocketBaseUrl', "https://pocketbase-dmi2.fly.dev/")

export const pinia = createPinia();
app.use(pinia);
initClient(pinia);
DatabaseManagerInstance.pb;

const store = useMainStore();

const init = async () => {
  store.roles = await DatabaseManagerInstance.fetchRoles();
  app.use(router);

  mountGameMasterManagerInstance(router);
  mountTeamManagerInstance(router);

  app.mount('#app');
}
init();
