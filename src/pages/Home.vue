<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {socket, state} from "../client";

const router = useRouter();
const roomId = ref('');

const goToDashboard = () => {
  if (state.connected) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}

onBeforeMount(() => {
  goToDashboard();
});

</script>
<template>
  <div>
    <h1>Home</h1>
    <div>State : {{ state.connected }}</div>
  </div>
</template>
<style scoped>

</style>