<script setup lang="ts">
import {onBeforeMount} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {ROLE, GAMESTEP} from "../common/Constants";
import {useGameStore} from "../stores/gameStore";
import {useMainStore} from "../stores/mainStore";

import StudentGame from "../components/game/student/StudentGame.vue";
import TeacherGame from "../components/game/teacher/TeacherGame.vue";
import Instruction from "../components/game/Instruction.vue";
import Congratulation from "../components/game/Congratulation.vue";
import Waiting from "../components/game/student/Waiting.vue";

import data from "../assets/game-data/game-data-v2.json";

const pb = DatabaseManagerInstance.pb;

const mainStore = useMainStore();
const gameStore = useGameStore();
const socket = getSocket();
const router = useRouter();
const route = useRoute();

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
    gameStore.$subscribe((mutation, state) => {
      console.log('gameStore.totalTeams', gameStore.totalTeams, gameStore.totalTeamsFinished)
      if (gameStore.currentStep === GAMESTEP.PLAY && gameStore.totalTeamsFinished === gameStore.totalTeams) {
        GameMasterManagerInstance.gameValidation()
      }
    });
  }
});
</script>

<template>
  <div class="w-full h-full grid grid-cols-12 text-center">
    <Instruction v-show="gameStore.currentStep === GAMESTEP.INSTRUCTION" class="col-start-3 col-span-8"
                 :data="gameData[mainStore.getFullGameId]"/>
    <TeacherGame
        v-if="mainStore.role === ROLE.TEACHER && (gameStore.currentStep === GAMESTEP.PLAY || gameStore.currentStep === GAMESTEP.END)"
        class="col-span-12" :data="gameData[mainStore.getFullGameId]"/>
    <StudentGame
        v-if="(mainStore.role === ROLE.STUDENT && gameStore.currentStep !== GAMESTEP.INSTRUCTION) || (mainStore.role === ROLE.STUDENT && gameStore.currentStep !== GAMESTEP.CONGRATS)"
        class="col-span-12" :data="gameData[mainStore.getFullGameId]" :teamId="gameStore.teamId"/>
    <Waiting
        v-show="mainStore.role === ROLE.STUDENT && (gameStore.currentStep === GAMESTEP.WAIT || gameStore.currentStep === GAMESTEP.END)"
        class="col-start-3 col-span-8" :data="gameStore.data" :teamId="gameStore.teamId"/>
    <Congratulation v-show="gameStore.currentStep === GAMESTEP.CONGRATS" class="col-start-3 col-span-8"
                    :data="gameData[mainStore.getFullGameId]"/>
  </div>
</template>
