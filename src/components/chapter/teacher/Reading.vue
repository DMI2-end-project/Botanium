<script setup lang="ts">
import {useChapterStore} from "../../../stores/chapterStore";
import {useMainStore} from "../../../stores/mainStore";

const mainStore = useMainStore();
const chapterStore = useChapterStore();
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center"
       v-html="chapterStore.data?.sections[mainStore.gameId][chapterStore.currentParagraph]?.text">
  </div>
</template>
