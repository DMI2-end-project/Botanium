<script lang="ts">
import { defineComponent, Component } from 'vue';
import {useRouter} from "vue-router";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {GAME_STEP, ROLE} from "../common/Constants";

import ModalView from "../components/common/ModalView.vue";
import TeamSignboard from "../components/common/TeamSignboard.vue";
import CircleButton from "../components/common/CircleButton.vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import GameHeader from "../components/game/GameHeader.vue";
import Connexion from "../components/game/teacher/Connexion.vue";

import gameData from "../assets/json/games-data.json";

import Wifi from "../assets/svg/ico-wifi.svg?component";

interface GameData {
  [key: string]: any;
}

export default defineComponent({
  name: 'GameLayout',
  components: {Breadcrumb, CircleButton, Connexion, GameHeader, ModalView, TeamSignboard, Wifi},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      router: useRouter(),
      socket: getSocket(),
      pb: DatabaseManagerInstance.pb,
      GMInstance: GameMasterManagerInstance,
      isModalOpen: false,
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
    getImage(): string {
      return '/game/background/' + this.mainStore.getFullGameId +'.png' as string
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

    this.gameStore.$subscribe((_, state) => {
      if (state.data) {
        document.documentElement.style.setProperty('--color-background', this.gameStore.data.color);
      }
    });
  },
  beforeMount() {
    if (this.gameStore.data) {
      document.documentElement.style.setProperty('--color-background', this.gameStore.data.color);
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
    },
    openModal() {
      this.mainStore.isModalOpen = true;
      this.isModalOpen = true
    },
    closeModal() {
      this.mainStore.isModalOpen = false;
      this.isModalOpen = false
    }
  }
});
</script>


<template>
  <div class="bg-cover bg-bottom bg-beige-medium fixed inset-0 pointer-events-none overflow-hidden"
       :class="backgroundColor"/>
  <div class="fixed inset-0 overflow-hidden">
    <Transition name="bgTransitionLeft1">
      <div v-show="gameStore.currentStep === 1 || gameStore.currentStep === 5" class="absolute bottom-0 h-2/3 w-fit max-w-[40%] origin-bottom">
        <img :src="getImage" alt=""
          class="-scale-x-100 h-full w-auto object-contain object-bottom">
      </div>
    </Transition>
    <Transition name="bgTransitionLeft2" v-if="mainStore.getFullGameId !== '00101' && mainStore.getFullGameId !== '00104'">
      <img v-show="gameStore.currentStep === 1 || gameStore.currentStep === 5" :src="getImage" alt="" class="absolute -bottom-[25%] left-[10%] h-1/2 w-auto object-contain origin-bottom">
    </Transition>
    <Transition name="bgTransitionRight2">
      <img v-show="gameStore.currentStep === 1 || gameStore.currentStep === 5" :src="getImage" alt="" class="absolute -bottom-0 -right-[5%] h-5/6 max-w-[60%] w-auto object-contain origin-bottom object-bottom">
    </Transition>
    <Transition name="bgTransitionRight1" v-if="mainStore.getFullGameId !== '00104'">
      <img v-show="gameStore.currentStep === 1 || gameStore.currentStep === 5" :src="getImage" alt="" class="absolute -bottom-0 right-[10%] h-1/2 w-auto object-contain origin-bottom">
    </Transition>
  </div>

  <div class="fixed top-0 left-0 right-0 bottom-0 flex flex-col">
    <header class="w-full mt-8">
      <Transition name="fade" :mode="gameStore.currentStep < 3 ? 'out-in' : 'default'">
          <component :is="isBreadcrumb ? 'Breadcrumb' : 'GameHeader'"/>
      </Transition>
    </header>
    <main class="w-full h-full flex flex-col">
      <slot></slot>
    </main>
  </div>
  <footer class="fixed bottom-0 flex gap-5 left-[2%] z-20">
    <TeamSignboard v-if="mainStore.role === ROLE.STUDENT" :text="gameStore.teamName"/>

    <div v-if="mainStore.role === ROLE.TEACHER">
      <CircleButton @click="openModal" text="Connexion" class="mb-4">
        <Wifi/>
      </CircleButton>

      <ModalView v-if="isModalOpen" @close="closeModal" :close="true" :click-outside="true" :padding="false">
        <Connexion class="h-full justify-between" :status-needed="true"/>
      </ModalView>
    </div>
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


<style scoped>
.bgTransitionLeft1-enter-from,
.bgTransitionLeft1-leave-to,
.bgTransitionLeft2-enter-from,
.bgTransitionLeft2-leave-to{
    transform: scaleX(1.2) translate(-200px, 30px) rotate(-50deg);
    opacity: 0;
}

.bgTransitionRight1-enter-from,
.bgTransitionRight1-leave-to,
.bgTransitionRight2-enter-from,
.bgTransitionRight2-leave-to{
    transform: scaleX(1.2) translate(200px, 30px) rotate(50deg);
    opacity: 0;
}

.bgTransitionLeft1-enter-active,
.bgTransitionRight1-enter-active {
    transition: transform 1.2s cubic-bezier(0.445, 1.375, 0.305, 1.000),
        opacity 0.2s ease-out;
}

.bgTransitionLeft2-enter-active,
.bgTransitionRight2-enter-active {
    transition: transform 1.2s cubic-bezier(0.445, 1.375, 0.305, 1.000) 0.2s,
        opacity 0.2s ease-out 0.2s;
}

.bgTransitionLeft1-leave-active,
.bgTransitionRight1-leave-active{
    transition: transform 0.9s cubic-bezier(0.36, 0, 0.66, -0.56) 0.2s,
        opacity 0.2s ease-in 0.9s;
}

.bgTransitionLeft2-leave-active,
.bgTransitionRight2-leave-active{
    transition: transform 0.9s cubic-bezier(0.36, 0, 0.66, -0.56),
        opacity 0.2s ease-in 0.7s;
}

</style>
