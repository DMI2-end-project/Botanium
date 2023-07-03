import {createRouter, createWebHistory, RouterOptions} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {AUDIO, ROLE} from "../common/Constants";

import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import Dashboard from "../pages/Dashboard.vue";
import Game from "../pages/Game.vue";
import LogBook from "../pages/LogBook.vue";
import Chapter from "../pages/Chapter.vue";
import Chapters from "../pages/Chapters.vue";
import PhotoTaking from "../pages/PhotoTaking.vue";
import Scan from "../pages/Scan.vue";
import Dev from "../pages/Dev.vue";
import {AudioManagerInstance} from "../common/AudioManager";

const config: RouterOptions = {
  history: createWebHistory(),
  routes: [
    {
      name: 'None',
      path: '/',
      redirect: (to) => {
        // TODO : not working error initClient main.ts
        
        if (DatabaseManagerInstance.pb.authStore.isValid) {
          let roles = DatabaseManagerInstance.roles;
          let role = roles.find(item => item.id === DatabaseManagerInstance.pb.authStore.model?.role);
          console.log('role', role);
          
          if (role) {
            switch (role.name) {
              case ROLE.TEACHER:
                return {name: 'Dashboard'}
              case ROLE.PARENT:
              case ROLE.STUDENT:
                return {name: 'Accueil'}
              default:
                return {name: 'Login'}
            }
          } else {
            return {name: 'Login'}
          }
          
        } else {
          return {name: 'Login'}
        }
      },
    },
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
        layout: 'Default',
      },
    },
    {
      name: 'Login',
      path: '/connexion',
      component: Login,
      meta: {
        layout: 'Default',
      },
    },
    {
      name: 'Dashboard',
      path: '/tableau-de-bord',
      component: Dashboard,
      meta: {
        layout: 'Default',
      },
    },
    {
      name: 'Chapters',
      path: '/chapitres',
      component: Chapters,
      meta: {
        layout: 'Default',
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
    {
      name: 'PhotoTaking',
      path: '/prise-de-photo',
      component: PhotoTaking,
      meta: {
        layout: 'Default',
      },
    }, {
      name: 'Scan',
      path: '/scan',
      component: Scan,
      meta: {
        layout: 'Default',
      },
    },
  ]
}

const router = createRouter(config);


router.beforeEach((to, from) => {
  const store = useMainStore();
  console.log(store.role, DatabaseManagerInstance.pb.authStore.model?.role);
  
  // Need auth to acces pages, redirect the user to the login page
  if (!DatabaseManagerInstance.pb.authStore.isValid && to.name !== 'Login') {
    return {name: 'Login'}
  }
  
  // TODO : not working, example : https://pinia.vuejs.org/core-concepts/outside-component-usage.html
  if (DatabaseManagerInstance.pb.authStore.isValid && to.name === 'Login') {
    let roles = DatabaseManagerInstance.roles;
    let role = roles.find(item => item.id === DatabaseManagerInstance.pb.authStore.model?.role);
    
    if (role) {
      switch (role.name) {
        case ROLE.TEACHER:
          return {name: 'Dashboard'}
        case ROLE.STUDENT:
        case ROLE.PARENT:
          return {name: 'Home'}
      }
    }
  }
  
  const play = () => {
    console.log('play');
    //AudioManagerInstance.play(AUDIO.BACKGROUND, 0.2);
  }
  
  // TODO : SIMULATE CLICK BY USER
  if (to.name !== 'Game' && to.name !== 'Chapter') {
    console.log('Out Chapter')
    document.addEventListener('click', play);
  } else {
    console.log('In Chapter');
    document.removeEventListener('click', play);
    AudioManagerInstance.pause(AUDIO.BACKGROUND);
  }
});

export default router;
