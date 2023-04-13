<script setup lang="ts">
import {onBeforeMount} from "vue";
import {getSocket} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {EVENT} from "../constants";
import {useStore} from "../stores/main";

const pb = DatabaseManagerInstance.pb;
const store = useStore();
const socket = getSocket();


onBeforeMount(async () => {
  await socket.connect();
  await socket.emit(EVENT.START_GAME, store.roomId)
})
</script>

<template>
  <div>State : {{ store.connected }}, RoomID : {{ store.roomId }}</div>
</template>
