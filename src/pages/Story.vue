<script setup lang="ts">

/*
  TODO :
     - Loaders Student
     - Loader Teacher
*/

import {onBeforeMount} from "vue";
import { getSocket } from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import StudentStory from "./../components/story/student/StudentStory.vue";
import TeacherStory from "./../components/story/teacher/TeacherStory.vue";
import { useMainStore } from "../stores/mainStore";
import {ROLE} from "../common/Constants"

const mainStore = useMainStore();

const pb = DatabaseManagerInstance.pb;

const socket = getSocket();

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
    <TeacherStory v-if="mainStore.role === ROLE.TEACHER" />
    <StudentStory v-if="mainStore.role === ROLE.STUDENT" />
  </div>
</template>
