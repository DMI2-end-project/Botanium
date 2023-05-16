<script setup lang="ts">
import {onBeforeMount} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {EVENT, ROLE, STEP} from "../common/Constants";
import {useGameStore} from "../stores/gameStore";
import {useMainStore} from "../stores/mainStore";

import StudentGame from "../components/game/student/StudentGame.vue";
import TeacherGame from "../components/game/teacher/TeacherGame.vue";
import Instruction from "../components/game/Instruction.vue";
import Congratulation from "../components/game/Congratulation.vue";

import data from "../assets/game-data/game-data-v2.json";
import Waiting from "../components/game/student/Waiting.vue";

const pb = DatabaseManagerInstance.pb;

const mainStore = useMainStore();
const gameStore = useGameStore();
const socket = getSocket();
const router = useRouter();
const route = useRoute();

console.log('router', route);

const gameData: {
  [key: string]: any
} = data;

onBeforeMount(async () => {
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore.roomId
  });

  if (mainStore.role === ROLE.TEACHER) {
    console.log('EVENT.LAUNCH_GAME', EVENT.LAUNCH_GAME, mainStore.roomId, mainStore.gameId)
    socket.emit(EVENT.LAUNCH_GAME, {
      roomId: mainStore.roomId,
      gameId: mainStore.gameId//mainStore.getFullGameId
    });

    console.log('subscribe', mainStore.role);
    gameStore.$subscribe((mutation, state) => {
      console.log('gameStore.totalTeams', gameStore.totalTeams, gameStore.totalTeamsFinished)
      if (gameStore.currentStep === STEP.PLAY && gameStore.totalTeamsFinished === gameStore.totalTeams) {
        gameStore.currentStep = STEP.END;
        socket.emit(EVENT.GAME_VALIDATION, {
          roomId: mainStore.roomId,
          step: STEP.END
        })
      }
    });
  }
  console.log('teamId', gameStore.teamId)
});
</script>

<template>
  <div class="w-full h-full grid grid-cols-12 text-center">
    <Instruction v-show="gameStore.currentStep === STEP.INSTRUCTION" class="col-start-3 col-span-8"
                 :data="gameData[mainStore.getFullGameId]"/>
    <TeacherGame
        v-if="mainStore.role === ROLE.TEACHER && (gameStore.currentStep === STEP.PLAY || gameStore.currentStep === STEP.END)"
        class="col-span-12" :data="gameData[mainStore.getFullGameId]"/>
    <StudentGame
        v-if="(mainStore.role === ROLE.STUDENT && gameStore.currentStep !== STEP.INSTRUCTION) || (mainStore.role === ROLE.STUDENT && gameStore.currentStep !== STEP.CONGRATS)"
        class="col-span-12" :data="gameStore.data" :teamId="gameStore.teamId"/>
    <Waiting
        v-show="mainStore.role === ROLE.STUDENT && (gameStore.currentStep === STEP.WAIT || gameStore.currentStep === STEP.END)"
        class="col-start-3 col-span-8" :data="gameStore.data" :teamId="gameStore.teamId"/>
    <Congratulation v-show="gameStore.currentStep === STEP.CONGRATS" class="col-start-3 col-span-8"
                    :data="gameData[mainStore.getFullGameId]"/>
  </div>
</template>
