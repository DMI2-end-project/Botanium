<script setup lang="ts">
/*
  TODO :
     - Loaders Student
     - Loader Teacher
*/

import {onBeforeMount, onMounted} from "vue";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {ROLE} from "../common/Constants"
import gameData from "../assets/game-data/game-data.json";

import StudentStory from "./../components/story/student/StudentStory.vue";
import TeacherStory from "./../components/story/teacher/TeacherStory.vue";

const mainStore = useMainStore();
const gameStore = useGameStore();

const pb = DatabaseManagerInstance.pb;

const socket = getSocket();

onBeforeMount(async () => {
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore.roomId
  });

  //  @ts-ignore
  gameStore.data = gameData[mainStore.getFullGameId];
})

onMounted(() => {

})
</script>

<template>
  <div class="w-full h-full">
    <TeacherStory v-if="mainStore.role === ROLE.TEACHER"/>
    <StudentStory v-if="mainStore.role === ROLE.STUDENT"/>
  </div>
</template>
