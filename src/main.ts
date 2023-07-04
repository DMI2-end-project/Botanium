import './style.css';
import {initClient} from "./client";
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import Particles from "vue3-particles";
declare module "vue3-particles";
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import {mountGameMasterManagerInstance} from "./common/GameMasterManager";
import {mountTeamManagerInstance} from "./common/TeamManager";
import router from "./router";
import App from './App.vue';
import {useMainStore} from "./stores/mainStore";
import {registerLayouts} from './layouts/register';

const app = createApp(App);

app.provide('pocketBaseUrl', "https://pocketbase-dmi2.fly.dev/");

export const pinia = createPinia();
app.use(pinia);
initClient(pinia);
DatabaseManagerInstance.pb;
app.use(Particles);

const store = useMainStore();

const init = async () => {
  store.roles = await DatabaseManagerInstance.fetchRoles();
  app.use(router);
  
  registerLayouts(app);
  
  mountGameMasterManagerInstance(router);
  mountTeamManagerInstance(router);
  
  app.mount('#app');
}
init();
