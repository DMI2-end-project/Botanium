<script setup lang="ts">
import {onBeforeMount, onMounted} from "vue";
import { getSocket } from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import StudentGame from "./../components/game/student/StudentGame.vue";
import TeacherGame from "./../components/game/teacher/TeacherGame.vue";
import { useStore } from "../stores/main";
import ROLE from "../constants/ROLE"

const store = useStore();

const pb = DatabaseManagerInstance.pb;
console.log('pb.authStore.model',pb.authStore.model)
const roomId = 2023 //pb.authStore.model?.id
const teamId = "2"
const isTeacher = store.role === ROLE.TEACHER;
const socket = getSocket()

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
    <h1>Jeu</h1>
    <div>Socket state : {{ store.connected }}, RoomID : {{ store.roomId }}, Role : {{ store.role }}</div>
    <StudentGame v-if="!isTeacher" :teamId="teamId" />
    <TeacherGame v-if="isTeacher" />
  </div>
</template>
