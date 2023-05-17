<script setup lang="ts">
import {useStoryStore} from "../../../stores/storyStore";

const storyStore = useStoryStore();
const props = defineProps(['data']);
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center"
       v-html="props.data.contents[storyStore.currentPart][storyStore.currentText].text">
  </div>
</template>
