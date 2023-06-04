<script setup lang="ts">
import {onBeforeMount, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {GameMasterManagerInstance} from "../common/GameMasterManager"
import {ROLE, GAME_STEP} from "../common/Constants";
import {useGameStore} from "../stores/gameStore";
import {useMainStore} from "../stores/mainStore";


import StudentGame from "../components/game/student/StudentGame.vue";
import TeacherGame from "../components/game/teacher/TeacherGame.vue";
import Instruction from "../components/game/Instruction.vue";
import Congratulation from "../components/game/Congratulation.vue";
import Waiting from "../components/game/student/Waiting.vue";

import gameData from "../assets/game-data/game-data-v2.json";

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

gameStore.$subscribe((mutation, state) => {
  if (state.data) {
    document.documentElement.style.setProperty('--color-background', gameStore.data.color);

    let currentSection = gameStore.data?.gameSequences[gameStore.currentSequence];
    while (mainStore.role === ROLE.TEACHER && currentSection && !currentSection.gamemaster && gameStore.currentSequence < gameStore.data?.gameSequences.length - 1) {
      gameStore.currentSequence += 1;
      GameMasterManagerInstance.nextSequence();
    }
  }
});

// TODO : localStorage.setItem('currentSequence', ???)
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

</script>

<template>
  <div v-if="gameStore.data"
       class="w-full h-full grid grid-cols-12 gap-4 px-8">
    <Instruction v-if="gameStore.currentStep === GAME_STEP.INSTRUCTION"
                 class="col-start-3 col-span-8"/>
    <TeacherGame
        v-if="mainStore.role === ROLE.TEACHER && (gameStore.currentStep === GAME_STEP.PLAY || gameStore.currentStep === GAME_STEP.END)"
        class="col-span-12"/>
    <StudentGame
        v-if="(mainStore.role === ROLE.STUDENT && gameStore.currentStep !== GAME_STEP.INSTRUCTION) || (mainStore.role === ROLE.STUDENT && gameStore.currentStep !== GAME_STEP.CONGRATS)"
        :teamId="gameStore.teamId"
        class="col-span-12"/>
    <Waiting
        v-if="mainStore.role === ROLE.STUDENT && (gameStore.currentStep === GAME_STEP.WAIT || gameStore.currentStep === GAME_STEP.END)"
        :teamId="gameStore.teamId"
        class="col-start-3 col-span-8"/>
    <Congratulation v-if="gameStore.currentStep === GAME_STEP.CONGRATS"
                    class="col-start-3 col-span-8"/>
  </div>
</template>
