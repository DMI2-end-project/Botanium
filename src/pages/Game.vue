<script setup lang="ts">
import {onBeforeMount, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {ROLE} from "../common/Constants";

import StudentGame from "./../components/game/student/StudentGame.vue";
import TeacherGame from "./../components/game/teacher/TeacherGame.vue";

const pb = DatabaseManagerInstance.pb;
console.log('pb.authStore.model', pb.authStore.model)
const roomId = 2023 //pb.authStore.model?.id

const mainStore = useMainStore();
const gameStore = useGameStore();
const socket = getSocket();
const router = useRouter();
const route = useRoute();

onBeforeMount(async () => {
  await socket.connect();
  await socket.emit('join', roomId);
});

console.log('teamId', gameStore.teamId)

</script>

<template>
  <div class="w-full h-full">
    <StudentGame v-if="mainStore.role === ROLE.STUDENT" :teamId="gameStore.teamId"/>
    <TeacherGame v-if="mainStore.role === ROLE.TEACHER"/>
  </div>
</template>
