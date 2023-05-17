<script setup lang="ts">
/*
  TODO :
     - Loaders Student
     - Loader Teacher
*/

import {onBeforeMount} from "vue";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useStoryStore} from "../stores/storyStore";
import {ROLE} from "../common/Constants";

import data from "../assets/chapters-data/chapters-data.json";

import StudentStory from "./../components/story/student/StudentStory.vue";
import TeacherStory from "./../components/story/teacher/TeacherStory.vue";

const mainStore = useMainStore();
const storyStore = useStoryStore();

const gameData: {
  [key: string]: any
} = data;

const socket = getSocket();

//  @ts-ignore
storyStore.data = data[mainStore.getChapterId];

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
    <TeacherStory v-if="mainStore.role === ROLE.TEACHER" :data="data[mainStore.getChapterId]"/>
    <StudentStory v-if="mainStore.role === ROLE.STUDENT" :data="data[mainStore.getChapterId]"/>
  </div>
</template>
