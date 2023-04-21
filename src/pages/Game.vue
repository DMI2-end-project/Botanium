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
  <div class="w-full h-full">
    <Instruction v-show="gameStore.currentStep === STEP.INSTRUCTION"/>
    <StudentGame v-if="mainStore.role === ROLE.STUDENT" :teamId="gameStore.teamId"/>
    <TeacherGame v-if="mainStore.role === ROLE.TEACHER"/>
  </div>
</template>
