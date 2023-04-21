<script setup lang="ts">
import {useMainStore} from "../../../stores/mainStore";

const mainStore = useMainStore()
</script>
<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="bg-white rounded-md p-6">
      <h1>Chapitre {{ mainStore.chapterId }}</h1>
      <h2>Capucine Pinpin et les carottes</h2>
    </div>
  </div>
</template>
<style scoped>

</style>