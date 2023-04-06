import {createRouter, createWebHistory, RouterOptions} from "vue-router";
import Home from "../src/pages/Home.vue";
import Login from "../src/pages/Login.vue";
import Dashboard from "../src/pages/Dashboard.vue";
import Game from "../src/pages/Game.vue";

const config: RouterOptions = {
  history: createWebHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home
    },
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: Dashboard
    },
    {
      name: 'Game',
      path: '/game',
      component: Game
    }
  ]
}

const router = createRouter(config);

export default router;