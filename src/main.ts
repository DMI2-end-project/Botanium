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

export const pinia = createPinia();
app.use(pinia);
initClient();
DatabaseManagerInstance.pb;

const store = useStore();
await store.fetchRoles();

app.use(router);

registerLayouts(app);

app.mount('#app');
