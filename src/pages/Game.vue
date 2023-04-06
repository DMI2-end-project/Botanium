<script setup lang="ts">
import {socket, state} from "../client";
import {ref} from "vue";

const roomId = ref('');
const joinRoom = async () => {
  await socket.connect();
  await socket.emit('join', roomId.value);
}
</script>
<template>
  <div>State : {{ state.connected }}</div>
  <form @submit.prevent="joinRoom">
    <label for="roomId">Room id :</label>
    <input type="text" name="roomId" v-model="roomId">
    <button type="submit">Joindre la room</button>
  </form>
</template>

<style scoped>

</style>