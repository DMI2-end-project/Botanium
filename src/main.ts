import {createApp} from 'vue';
import PocketBase from 'pocketbase';
import router from "../router";
import App from './App.vue';

import './style.css';

const pb = new PocketBase('https://pocketbase-dmi2.fly.dev');//https://pocketbase-dmi2.fly.dev // http://127.0.0.1:8090/

//createApp(App).mount('#app')
const app = createApp(App);
app.provide('pb', pb);
router.beforeEach((to, from) => {
  if (!pb.authStore.isValid && to.name !== 'Login') {
    // redirect the user to the login page
    return {name: 'Login'}
  }
})
app.use(router);

app.mount('#app');
