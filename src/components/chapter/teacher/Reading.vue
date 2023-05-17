<script setup lang="ts">
import {useChapterStore} from "../../../stores/chapterStore";

const chapterStore = useChapterStore();
const props = defineProps(['data']);
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center"
       v-html="props.data.sections[chapterStore.currentSection][chapterStore.currentParagraph].text">
  </div>
</template>
