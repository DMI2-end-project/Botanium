<script setup lang="ts">
import {GameMasterManagerInstance} from "./../common/GameMasterManager";

// TODO : Add modal intermédiaire
const props = defineProps(['chapterId']);

const launchStory = () => {
  GameMasterManagerInstance.launchChapter(props.chapterId);
}

</script>
<template>
  <button class="inline-block bg-beige rounded-md p-2" @click="launchStory">
    Chapitre {{ chapterId }}
  </button>
</template>
<style scoped>

</style>
