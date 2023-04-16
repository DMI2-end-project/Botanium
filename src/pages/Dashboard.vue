<script setup lang="ts">
import {useStore} from "../stores/main";

const store = useStore();

</script>
<template>
  <div>
    <h1>Dashboard</h1>
    <router-link :to="{ path: 'game/'+ store.fullGameId}">Let's play !</router-link>
    <br>
    <router-link :to="{ name: 'LogBook'}">Carnet de bord</router-link>
    <!-- query: { id: store.fullGameId }} -->
  </div>
</template>
<style scoped>

</style>
