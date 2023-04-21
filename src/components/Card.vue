<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";

// TODO : Add modal intermédiaire
const mainStore = useMainStore();
const props = defineProps(['chapterId']);

</script>
<template>
  <router-link :to="{ path: '/histoire/'+ mainStore.getChapterId }"
               class="inline-block bg-white rounded-md p-2">
    Chapitre {{ chapterId }}
  </router-link>
</template>
<style scoped>

</style>