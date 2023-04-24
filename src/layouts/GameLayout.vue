<template>
  <div class="bg-green-medium flex flex-col w-full h-full min-h-screen">
    <header class="flex flex-col w-full h-full p-4 z-20">
        <!-- DEV INFO -->
        <div class="flex justify-between items-center gap-6">
          <div>
            Path : {{ router.currentRoute.path }},
            Auth state : {{ pb.authStore.isValid }},
            Role : {{ mainStore.role }}
          </div>
          <div>
            Socket state : {{ mainStore.connected }},
            RoomID : {{ mainStore.roomId }},
            TeamID : {{ gameStore.teamId }},
            Step : {{ gameStore.currentStep }}
          </div>
          <button @click="disconnect" class="ml-auto block">Déconnexion</button>
        </div>
      <Breadcrumb v-show="gameStore.currentStep !== STEP.PLAY"/>
      <GameHeader v-show="gameStore.currentStep === STEP.PLAY" :data="gameData[mainStore.getFullGameId]"/>
      <slot name="header"/>
    </header>
    <main class="w-full h-full">
      <!--The <slot> element is a slot outlet that indicates where the "VIEW" content should be rendered.-->
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useGameStore} from "../stores/gameStore";
import Breadcrumb from "../components/Breadcrumb.vue";
import GameHeaderComponent from "../components/game/GameHeader.vue";
import gameData from "../assets/game-data/game-data.json";
import {STEP} from "../common/Constants";
import GameHeader from "../components/game/GameHeader.vue";

export default defineComponent({
  name: 'GameLayout',
  computed: {
    STEP() {
      return STEP
    }
  },
  components: {GameHeader, GameHeaderComponent, Breadcrumb},
  data() {
    return {
      gameData: gameData,
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      router: useRouter(),
      socket: getSocket(),
      pb: DatabaseManagerInstance.pb
    }
  },
  mounted() {
    console.log('router', this.router)
    if (this.mainStore.getFullGameId) {
      // @ts-ignore
      this.gameStore.data = gameData[this.mainStore.getFullGameId]
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

<style lang="scss" scoped>

</style>
