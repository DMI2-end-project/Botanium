import {createRouter, createWebHistory, RouterOptions} from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import Game from "../pages/Game.vue";
import {useStore} from "../stores/main";
import { DatabaseManagerInstance } from "../common/DatabaseManager";

const config: RouterOptions = {
  history: createWebHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home,
      meta: {
        layout: 'Dev',
      },
    },
    {
      name: 'Login',
      path: '/login',
      component: Login,
      meta: {
        layout: 'Dev',
      },
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: Dashboard,
      meta: {
        layout: 'Dev',
      },
    },
    {
      name: 'Game',
      path: '/game/:id',
      component: Game,
      meta: {
        layout: 'Dev',
      },
    }
  ]
}

const router = createRouter(config);

router.beforeEach((to, from) => {
  const store = useStore();

  // Need auth to acces pages, redirect the user to the login page
  if (!DatabaseManagerInstance.pb.authStore.isValid && to.name !== 'Login') {
    return {name: 'Login'}
  }

  // TODO : not working, example : https://pinia.vuejs.org/core-concepts/outside-component-usage.html
  if (DatabaseManagerInstance.pb.authStore.isValid && to.name === 'Login') {
    let roles = DatabaseManagerInstance.roles;
    let role = roles.find(item => item.id === DatabaseManagerInstance.pb.authStore.model?.role);
    console.log('role', store.role, role)
    switch (store.role) {
      case 'teacher':
        return {name: 'Dashboard'}
      case 'student':
        return {name: 'Home'}
    }
  }

  if(DatabaseManagerInstance.pb.authStore.isValid) {

  }
});

export default router;
