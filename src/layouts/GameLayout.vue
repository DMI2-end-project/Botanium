<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {GAME_STEP, ROLE} from "../common/Constants";

import Breadcrumb from "../components/Breadcrumb.vue";
import GameHeader from "../components/game/GameHeader.vue";
import TeamSignboard from "../components/common/TeamSignboard.vue";
import Connexion from "../components/game/teacher/Connexion.vue";

import gameData from "../assets/game-data/game-data.json";

interface GameData {
  [key: string]: any;
}

export default defineComponent({
  name: 'GameLayout',
  components: {GameHeader, Breadcrumb, TeamSignboard, Connexion},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      router: useRouter(),
      socket: getSocket(),
      pb: DatabaseManagerInstance.pb,
      GMInstance: GameMasterManagerInstance
    }
  },
  computed: {
    gameData(): { [key: string]: any } {
      return gameData;
    },
    isBreadcrumb(): boolean {
      return this.gameStore.currentStep !== GAME_STEP.PLAY && this.gameData.currentStep !== GAME_STEP.WAIT
    },
    ROLE() {
      return ROLE
    },
    backgroundImage(): string {
      return 'bg-' + this.mainStore.getFullGameId as string
    },
    backgroundColor(): string {
      if (this.gameStore.data) {
        return 'bg-texture-' + this.gameStore.data.color as string
      }
      return '';
    }
  },
  created() {
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
  <div class="bg-cover bg-bottom fixed top-0 left-0 bottom-0 right-0 w-screen pointer-events-none overflow-hidden"
       :class="backgroundColor"/>
  <div
      class="bg-cover bg-bottom fixed top-0 left-0 bottom-0 right-0 w-screen pointer-events-none overflow-hidden"
      :class="gameStore.currentStep !== 1 && gameStore.currentStep !== 5 ? '' : backgroundImage"/>

  <div class="border-4 border-red bg-red/20 fixed top-0 left-0 right-0 bottom-0 flex flex-col">
    <header class="border-4 border-purple bg-purple/20 w-full mt-8">
      <Breadcrumb v-if="isBreadcrumb"/>
      <GameHeader v-if="!isBreadcrumb"/>
    </header>
    <main class="relative border-4 border-blue w-full h-full flex flex-col">
      <slot></slot>
    </main>
  </div>
  <footer class="fixed bottom-0 flex gap-5 left-[2%] z-20">
    <TeamSignboard v-if="mainStore.role === ROLE.STUDENT" :text="gameStore.teamName"/>
    <Connexion v-if="mainStore.role === ROLE.TEACHER"/>
  </footer>
  <!--div class="flex-1 flex flex-col w-full h-full min-h-screen max-h-screen gap-10">
    <header class="w-full mt-8 z-20">
      <Breadcrumb v-if="isBreadcrumb"/>
      <GameHeader v-if="!isBreadcrumb"/>
    </header>
    <main class="w-screen flex-1 h-full flex flex-col justify-center pb-10 z-10">
      <slot></slot>
    </main>
    <footer class="fixed bottom-0 flex gap-5 left-[2%] z-20">
      <TeamSignboard v-if="mainStore.role === ROLE.STUDENT" :text="gameStore.teamName"/>
      <Connexion v-if="mainStore.role === ROLE.TEACHER"/>
    </footer>
  </div-->
</template>
