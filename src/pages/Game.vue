<script setup lang="ts">
import {onBeforeMount} from "vue";
import {socket, state} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import Instruction from "./../components/game/Instruction.vue";

const pb = DatabaseManagerInstance.pb;
console.log('pb.authStore.model',pb.authStore.model)
const roomId = 2023 //pb.authStore.model?.id
const teamId = "2"

//const classId  = await pb.collection('classroom').getOne()

onBeforeMount(async() => {
  await socket.connect();
  await socket.emit('join', roomId);
})
</script>

<template>
  <div>
    <div>State : {{ state.connected }}, RoomID : {{ roomId }}</div>
    <div>Game ID {{ $route.params.id }}</div>
    <Instruction :teamId="teamId" />
  </div>
</template>
