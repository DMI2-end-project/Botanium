<script setup lang="ts">
import {GameMasterManagerInstance} from "./../common/GameMasterManager";

// TODO : Add modal intermédiaire
const props = defineProps(['chapterId']);

const launchChapter = () => {
  GameMasterManagerInstance.launchChapter(props.chapterId);
}

</script>
<template>
  <button class="inline-block bg-beige rounded-md p-2" @click="launchChapter">
    Chapitre {{ chapterId }}
  </button>
</template>
<style scoped>

</style>
