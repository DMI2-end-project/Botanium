<script setup lang="ts">
import {onBeforeMount} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {ROLE, STEP} from "../common/Constants";

import gameData from "../assets/game-data/game-data.json";

import StudentGame from "../components/game/student/StudentGame.vue";
import TeacherGame from "../components/game/teacher/TeacherGame.vue";
import Instruction from "../components/game/Instruction.vue";
import Congratulation from "../components/game/Congratulation.vue";

const pb = DatabaseManagerInstance.pb;
console.log('pb.authStore.model', pb.authStore.model)

const mainStore = useMainStore();
const gameStore = useGameStore();
const socket = getSocket();
const router = useRouter();
const route = useRoute();

onBeforeMount(async () => {
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore.roomId
  });

  // @ts-ignore
  gameStore.data = gameData[mainStore.getFullGameId];
  console.log('teamId', gameStore.teamId)
  console.log('data', gameStore.data)
  console.log('currentStep', gameStore.currentStep, STEP.INSTRUCTION, gameStore.currentStep === STEP.INSTRUCTION)
});

</script>

<template>
  <div class="w-full h-full bg-green-medium grid grid-cols-12 text-center">
    <Instruction v-show="gameStore.currentStep === STEP.INSTRUCTION" class=" col-start-3 col-span-8"/>
    <StudentGame v-show="mainStore.role === ROLE.STUDENT" :teamId="gameStore.teamId"/>
    <TeacherGame v-show="mainStore.role === ROLE.TEACHER"/>
    <Congratulation v-show="gameStore.currentStep === STEP.CONGRATS" class=" col-start-3 col-span-8"/>
  </div>
</template>
