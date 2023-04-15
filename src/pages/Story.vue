<script setup lang="ts">
import {onBeforeMount} from "vue";
import { getSocket } from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import StudentStory from "./../components/story/student/StudentStory.vue";
import TeacherStory from "./../components/story/teacher/TeacherStory.vue";
import { useStore } from "../stores/main";
import {ROLE} from "../common/Constants"

const store = useStore();

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
    <!-- <div>State : {{ state.connected }}, RoomID : {{ roomId }}</div>
    <div>Game ID {{ $route.params.id }}</div> -->
    <!-- <h1>Jeu</h1> -->
    <TeacherStory v-if="store.role === ROLE.TEACHER" />
    <StudentStory v-if="store.role === ROLE.STUDENT" />
  </div>
</template>
