<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {GAME_STEP, ROLE} from "../common/Constants";

import Breadcrumb from "../components/Breadcrumb.vue";
import GameHeader from "../components/game/GameHeader.vue";
import TeamSignboard from "../components/common/TeamSignboard.vue";
import Connexion from "../components/game/teacher/Connexion.vue";

import gameData from "../assets/game-data/game-data-v2.json"; // {[key: string]: any}

interface GameData {
  [key: string]: any;
}

export default defineComponent({
  name: 'GameLayout',
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
  },
  components: {GameHeader, Breadcrumb, TeamSignboard, Connexion},
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
  <div class="bg-background flex flex-col w-full h-full min-h-screen">
    <header class="fixed flex flex-col w-full max-w-full p-10 z-20" :class="isBreadcrumb ? 'px-[10%]' : 'px-[4%]'">
      <!-- DEV INFO -->
      <div class="flex justify-end items-center gap-6 fixed z-20 right-6 top-0">
        <!-- <div>
          Path : {{ router.currentRoute?.path }},
          Auth state : {{ pb.authStore.isValid }},
          Role : {{ mainStore.role }}
        </div> -->
        <div class="ml-20">
          Socket state : {{ mainStore.connected }},
          RoomID : {{ mainStore.roomId }},
          TeamID : {{ gameStore.teamId }},
          <!-- GameId : {{ mainStore.gameId }},
          Step : {{ gameStore.currentStep }}, -->
        </div>
        <button @click="disconnect" class="ml-auto block">Déconnexion</button>
      </div>
      <Breadcrumb v-if="isBreadcrumb" :teamId="gameStore.teamId"/>
      <GameHeader v-if="!isBreadcrumb" :teamId="gameStore.teamId"/>
      <slot name="header"/>
    </header>
    <main class="w-screen h-screen flex-1 flex flex-col justify-center mt-16" :class="isBreadcrumb ? 'px-[10%]' : 'px-[4%]'">
      <slot></slot>
    </main>
    <footer class="fixed bottom-0 left-[2%]">
      <TeamSignboard v-if="mainStore.role === ROLE.STUDENT" :text="gameStore.teamName" />
      <Connexion v-if="mainStore.role === ROLE.TEACHER" />
    </footer>
  </div>
</template>
