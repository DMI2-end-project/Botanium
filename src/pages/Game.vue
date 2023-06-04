<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import { GameMasterManagerInstance } from "../common/GameMasterManager";
import { AudioManagerInstance } from "../common/AudioManager";
import {ROLE, GAME_STEP} from "../common/Constants";
import {useGameStore} from "../stores/gameStore";
import { useMainStore } from "../stores/mainStore";
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

mainStore.$subscribe((mutation, state) => {
  if (gameStore.data) {
    document.documentElement.style.setProperty('--color-background', gameStore.data.color);

    let currentSection = gameStore.data?.gameSequences[gameStore.currentSequence];
    while (mainStore.role === ROLE.TEACHER && currentSection && !currentSection.gamemaster && gameStore.currentSequence < gameStore.data?.gameSequences.length - 1) {
      gameStore.currentSequence += 1;
      GameMasterManagerInstance.nextSequence();
    }
  }
});

gameStore.$subscribe((_, state) => {
  if (state.data) {
    document.documentElement.style.setProperty('--color-background', gameStore.data.color);

    let currentSection
    if (gameStore.data && gameStore.currentSequence) {
      currentSection = gameStore.data?.gameSequences[gameStore.currentSequence];
    }
    while (mainStore.role === ROLE.TEACHER && currentSection && !currentSection.gamemaster && gameStore.currentSequence < gameStore.data?.gameSequences.length - 1) {
      gameStore.currentSequence += 1;
      GameMasterManagerInstance.nextSequence();
    }
  }
});

onBeforeMount(async () => {
  if (gameStore.data) {
    document.documentElement.style.setProperty('--color-background', gameStore.data.color);
  }

  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore.roomId
  });
});

onMounted(() => {

})

let isModalOpen: Ref<Boolean> = ref(false);

const getMicro = async () => {
  const hasMicro = await AudioManagerInstance.getMicrophone();
  if (hasMicro) {
    isModalOpen.value = false
    mainStore.isModalOpen = false
    AudioManagerInstance.startMicrophone()
  } else {
    isModalOpen.value = true
    mainStore.isModalOpen = true
  }
}

const readyWithoutMicro = () => {
  isModalOpen.value = false
  mainStore.isModalOpen = false
  AudioManagerInstance.startWithoutMicrophone()
}

</script>

<template>
  <div v-if="gameStore.data"
       class="w-full h-full grid grid-cols-12 gap-4 px-8">
    <Instruction v-if="gameStore.currentStep === GAME_STEP.INSTRUCTION" @get-microphone="getMicro"
                 class="col-start-3 col-span-8"/>
    <TeacherGame
        v-if="mainStore.role === ROLE.TEACHER && (gameStore.currentStep === GAME_STEP.PLAY || gameStore.currentStep === GAME_STEP.END)"
        class="col-span-12"/>
    <StudentGame
        v-if="(mainStore.role === ROLE.STUDENT && gameStore.currentStep !== GAME_STEP.INSTRUCTION) || (mainStore.role === ROLE.STUDENT && gameStore.currentStep !== GAME_STEP.CONGRATS)"
        class="col-span-12"/>
    <Waiting
        v-if="mainStore.role === ROLE.STUDENT && (gameStore.currentStep === GAME_STEP.WAIT || gameStore.currentStep === GAME_STEP.END)"
        class="col-start-3 col-span-8"/>
    <Congratulation v-if="gameStore.currentStep === GAME_STEP.CONGRATS"
                    class="col-start-3 col-span-8"/>
  </div>
  <ModalView v-if="isModalOpen">
      <div class="relative my-2 flex flex-col items-center">
        <h3 class="mt-8 text-center">Appelle ton enseignant pour qu’il active le son</h3>
        <p class="text-center mt-8">Rendez vous dans les réglages du navigateur pour activer le micro ou continuer l’activité sans : la synchronisation du son ne prendra pas en compte le micro de cette tabalette</p>
        <div class="flex justify-center items-center gap-6">
          <button @click="getMicro">Retester l'activiation du micro</button>
          <button @click="readyWithoutMicro">Faire l'activité sans le micro</button>
        </div>
      </div>
    </ModalView>
</template>
