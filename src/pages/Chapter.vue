<script setup lang="ts">
/*
  TODO :
     - Loaders Student
     - Loader Teacher
*/

import {onBeforeMount} from "vue";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useChapterStore} from "../stores/chapterStore";
import {ROLE} from "../common/Constants";

import data from "../assets/chapters-data/chapters-data.json";

import StudentChapter from "./../components/chapter/student/StudentChapter.vue";
import TeacherChapter from "./../components/chapter/teacher/TeacherChapter.vue";

const mainStore = useMainStore();
const chapterStore = useChapterStore();

const gameData: {
  [key: string]: any
} = data;

const socket = getSocket();

//  @ts-ignore
chapterStore.data = data[mainStore.getChapterId];

onBeforeMount(async () => {
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore.roomId
  });
})
</script>

<template>
  <div class="w-full h-full">
    <TeacherChapter v-if="mainStore.role === ROLE.TEACHER" :data="data[mainStore.getChapterId]"/>
    <StudentChapter v-if="mainStore.role === ROLE.STUDENT" :data="data[mainStore.getChapterId]"/>
  </div>
</template>
