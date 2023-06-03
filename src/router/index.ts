import {createRouter, createWebHistory, RouterOptions} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {ROLE} from "../common/Constants";
import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import Dashboard from "../pages/Dashboard.vue";
import Game from "../pages/Game.vue";
import LogBook from "../pages/LogBook.vue";
import Chapter from "../pages/Chapter.vue";
import Chapters from "../pages/Chapters.vue";
import Dev from "../pages/Dev.vue";

const config: RouterOptions = {
  history: createWebHistory(),
  routes: [
    {
      name: 'Dev',
      path: '/dev',
      component: Dev,
      meta: {
        layout: 'Dev',
      },
    },
    {
      name: 'Home',
      path: '/accueil',
      component: Home,
      meta: {
        layout: 'Dev',
      },
    },
    {
      name: 'Login',
      path: '/connexion',
      component: Login,
      meta: {
        layout: 'Dev',
      },
    },
    {
      name: 'Dashboard',
      path: '/tableau-de-bord',
      component: Dashboard,
      meta: {
        layout: 'Dev',
      },
    },
    {
      name: 'Chapters',
      path: '/chapitres',
      component: Chapters,
      meta: {
        layout: 'Dev',
      }
    },
    {
      name: 'Chapter',
      path: '/chapitre/:id', // 001
      component: Chapter,
      meta: {
        layout: 'Chapter',
      }
    },
    {
      name: 'Game',
      path: '/exercice/:id', // 00101
      component: Game,
      meta: {
        layout: 'Game',
      },
    },
    {
      name: 'LogBook',
      path: '/carnet-de-bord',
      component: LogBook,
      meta: {
        layout: 'LogBook',
      },
    },
  ]
}

const router = createRouter(config);

router.beforeEach((to, from) => {
  const store = useMainStore();

  // Need auth to acces pages, redirect the user to the login page
  if (!DatabaseManagerInstance.pb.authStore.isValid && to.name !== 'Login') {
    return {name: 'Login'}
  }

  // TODO : not working, example : https://pinia.vuejs.org/core-concepts/outside-component-usage.html
  if (DatabaseManagerInstance.pb.authStore.isValid && to.name === 'Login') {
    let roles = DatabaseManagerInstance.roles;
    let role = roles.find(item => item.id === DatabaseManagerInstance.pb.authStore.model?.role);

    switch (store.role) {
      case ROLE.TEACHER:
        return {name: 'Dashboard'}
      case ROLE.STUDENT:
      case ROLE.PARENT:
        return {name: 'Home'}
    }
  }

  if (DatabaseManagerInstance.pb.authStore.isValid) {

  }
});

export default router;
