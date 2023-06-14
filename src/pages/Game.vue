<script setup lang="ts">
import {onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {TeamManagerInstance} from '../common/TeamManager';
import GameFacade from "../common/GameFacade";
import {ROLE, GAME_STEP} from "../common/Constants";
import {useGameStore} from "../stores/gameStore";
import {useMainStore} from "../stores/mainStore";
import type {Ref} from 'vue';

import StudentGame from "../components/game/student/StudentGame.vue";
import TeacherGame from "../components/game/teacher/TeacherGame.vue";
import Instruction from "../components/game/Instruction.vue";
import Congratulation from "../components/game/Congratulation.vue";
import Waiting from "../components/game/student/Waiting.vue";
import ModalView from "../components/common/ModalView.vue";

const pb = DatabaseManagerInstance.pb;

const mainStore = useMainStore();
const gameStore = useGameStore();
const socket = getSocket();
const router = useRouter();
const route = useRoute();
let gameFacade:GameFacade

const setSequence = () => {
  let currentSequence = gameStore.data.gameSequences[gameStore.currentSequence];

  if (currentSequence) {
    switch (mainStore.role) {
      case ROLE.TEACHER:
        while (!currentSequence.gameStore && gameStore.currentSequence < gameStore.data.gameSequences.length - 1) {
          gameStore.currentSequence += 1;
          GameMasterManagerInstance.nextSequence();
        }
        break;
      case ROLE.STUDENT:
        break;
    }
  }
}

const setNeeded = () => {
  let currentSequence = gameStore.data.gameSequences[gameStore.currentSequence];
  if (currentSequence.microNeeded && gameFacade) {
    gameFacade.microIsNeeded()
  }
}

gameStore.$subscribe((_, state) => {
  if (state.data) {
    setSequence();
    setNeeded()
  }
});

onBeforeMount(async () => {
  gameFacade = new GameFacade()
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore.roomId
  });
  if (gameStore.data) {
    setSequence();
    setNeeded()
  }
});

onBeforeUnmount(() => {
  if (gameFacade) {
    gameFacade.kill()
  }
})

let isModalOpen: Ref<Boolean> = ref(false);

const getMicro = async () => {
  console.log('getMicro')
  if (!gameFacade.audio) return
  const hasMicro = await gameFacade.audio.getMicrophone();
  console.log('hasMicro', hasMicro)
  if (hasMicro) {
    isModalOpen.value = false
    mainStore.isModalOpen = false
    await TeamManagerInstance.microReady(true);
  } else {
    isModalOpen.value = true
    mainStore.isModalOpen = true
  }
}

const readyWithoutMicro = () => {
  isModalOpen.value = false
  mainStore.isModalOpen = false
  TeamManagerInstance.microReady(false);
}

const closeModal = () => {
  isModalOpen.value = false
  mainStore.isModalOpen = false
}

</script>

<template>
  <div v-if="gameStore.data"
       class="border-4 border-pink bg-pink/20 grid grid-cols-12 my-auto pb-12">
    <Instruction v-if="gameStore.currentStep === GAME_STEP.INSTRUCTION" @get-microphone="getMicro"
                 class="col-start-2 col-span-10 lg:col-start-3 lg:col-span-8"/>
    <TeacherGame
        v-if="mainStore.role === ROLE.TEACHER && (gameStore.currentStep === GAME_STEP.PLAY || gameStore.currentStep === GAME_STEP.END)"
        class="flex flex-col justify-center h-full col-span-12 my-auto"/>
    <StudentGame
        v-if="mainStore.role === ROLE.STUDENT && gameStore.currentStep == GAME_STEP.PLAY"
        :gameFacade="gameFacade"
        class="flex-1 h-full col-span-12 my-auto"/>
    <Waiting
        v-if="mainStore.role === ROLE.STUDENT && (gameStore.currentStep === GAME_STEP.WAIT || gameStore.currentStep === GAME_STEP.END)"
        class="col-start-2 col-span-10 lg:col-start-3 lg:col-span-8"/>
    <Congratulation v-if="gameStore.currentStep === GAME_STEP.CONGRATS"
                    class="col-start-2 col-span-10 lg:col-start-3 lg:col-span-8"/>
  </div>
  <ModalView v-if="isModalOpen" @close="closeModal" :close="false" :click-outside="true">
    <h1>Appelle ton enseignant pour qu’il active le son</h1>
    <p>Rendez vous dans les réglages du navigateur pour activer le micro ou continuer l’activité sans : la
      synchronisation du son ne prendra pas en compte le micro de cette tabalette</p>
    <div class="flex justify-center items-center gap-6">
      <button @click="getMicro">Retester l'activation du micro</button>
      <button @click="readyWithoutMicro">Faire l'activité sans le micro</button>
    </div>
  </ModalView>
</template>
