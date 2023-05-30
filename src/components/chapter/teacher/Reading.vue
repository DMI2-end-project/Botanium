<script setup lang="ts">
import {useChapterStore} from "../../../stores/chapterStore";
import {useMainStore} from "../../../stores/mainStore";

const mainStore = useMainStore();
const chapterStore = useChapterStore();
const props = defineProps(['data']);
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center"
       v-html="props.data.sections[mainStore.gameId][chapterStore.currentParagraph].text">
  </div>
</template>
