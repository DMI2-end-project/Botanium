import './style.css';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import router from "./router";
import App from './App.vue';
import {useStore} from "./stores/main";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

DatabaseManagerInstance.pb;
const store = useStore();
store.fetchRoles();

app.use(router);

app.mount('#app');