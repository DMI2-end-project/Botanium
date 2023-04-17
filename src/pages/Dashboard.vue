<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {leading} from "../common/Lib";

const store = useMainStore();

</script>
<template>
  <div>
    <h1>Dashboard</h1>
    <router-link :to="{ path: '/histoire/'+ store.getChapterId }">Lancer le chapitre {{ store.chapterId }}</router-link>
    <!-- query: { id: store.getFullGameId }} -->
  </div>
</template>
<style scoped>

</style>