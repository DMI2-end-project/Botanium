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

const store = useMainStore();

const pb = DatabaseManagerInstance.pb;

const roomId = 2023 //pb.authStore.model?.id;
const teamId = "2";
const isTeacher = store.role === ROLE.TEACHER;
// console.log(isTeacher, store.role, ROLE.TEACHER)
const socket = getSocket();

//const classId  = await pb.collection('classroom').getOne()

onBeforeMount(async () => {
  await socket.connect();
  await socket.emit('join', roomId);
})
</script>

<template>
  <div class="w-full h-full">
    <TeacherStory v-if="store.role === ROLE.TEACHER" />
    <StudentStory v-if="store.role === ROLE.STUDENT" />
  </div>
</template>
