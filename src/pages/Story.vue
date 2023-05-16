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
import {ROLE} from "../common/Constants";

import gameData from "../assets/game-data/game-data-v2.json";
import chaptersData from "../assets/chapters-data/chapters-data.json";

import StudentStory from "./../components/story/student/StudentStory.vue";
import TeacherStory from "./../components/story/teacher/TeacherStory.vue";

const mainStore = useMainStore();
const gameStore = useGameStore();

const pb = DatabaseManagerInstance.pb;

const socket = getSocket();

//  @ts-ignore
const chapterData = chaptersData[mainStore.getChapterId];
//  @ts-ignore
gameStore.data = gameData[mainStore.getFullGameId];

onBeforeMount(async () => {
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore.roomId
  });
})

onMounted(() => {
  gameStore.reset()
})
</script>

<template>
  <div class="w-full h-full">
    <TeacherStory v-if="mainStore.role === ROLE.TEACHER" :data="chapterData"/>
    <StudentStory v-if="mainStore.role === ROLE.STUDENT" :data="chapterData"/>
  </div>
</template>
