<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {STEP} from "../common/Constants";

import Breadcrumb from "../components/Breadcrumb.vue";
import GameHeader from "../components/game/GameHeader.vue";

import gameData from "../assets/game-data/game-data-v2.json"; // {[key: string]: any}

interface GameData {
  [key: string]: any;
}

export default defineComponent({
  name: 'GameLayout',
  computed: {
    STEP() {
      return STEP
    },
    gameData(): { [key: string]: any } {
      return gameData;
    }
  },
  components: {GameHeader, Breadcrumb},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      router: useRouter(),
      socket: getSocket(),
      pb: DatabaseManagerInstance.pb,
    }
  },
  created() {
    if (this.router) {
      // TODO : à quoi ça sert ?
      //this.mainStore.gameId = Number(this.$route.params.id);
    }
    if (this.mainStore.getFullGameId) {
      const key = this.mainStore.getFullGameId as string;
      const data: GameData = gameData;
      this.gameStore.data = data[key];
    }
  },
  methods: {
    DatabaseManagerInstance() {
      return DatabaseManagerInstance
    },
    disconnect() {
      this.socket.disconnect();
      this.pb.authStore.clear();
      this.mainStore.reset();
      this.gameStore.reset();
      this.router.push({
        name: 'Login'
      });
    }
  }
});
</script>


<template>
  <div class="bg-green-medium flex flex-col w-full h-full min-h-screen">
    <header class="flex flex-col w-full h-full p-4 z-20">
      <!-- DEV INFO -->
      <div class="flex justify-between items-center gap-6">
        <div>
          Path : {{ router.currentRoute?.path }},
          Auth state : {{ pb.authStore.isValid }},
          Role : {{ mainStore.role }}
        </div>
        <div>
          Socket state : {{ mainStore.connected }},
          RoomID : {{ mainStore.roomId }},
          TeamID : {{ gameStore.teamId }},
          GameId : {{ mainStore.gameId }},
          Step : {{ gameStore.currentStep }},
        </div>
        <button @click="disconnect" class="ml-auto block">Déconnexion</button>
      </div>
      <Breadcrumb v-show="gameStore.currentStep !== STEP.PLAY && gameStore.currentStep !== STEP.WAIT"/>
      <GameHeader v-show="gameStore.currentStep === STEP.PLAY || gameStore.currentStep === STEP.WAIT" :data="gameData[mainStore.getFullGameId]"/>
      <slot name="header"/>
    </header>
    <main class="w-full h-full">
      <slot></slot>
    </main>
  </div>
</template>
