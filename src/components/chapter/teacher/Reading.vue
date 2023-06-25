<script setup lang="ts">
import {useChapterStore} from "../../../stores/chapterStore";
import {useMainStore} from "../../../stores/mainStore";
import {CHAPTER_STEP, COLOR} from "../../../common/Constants";
import RoundButton from "../../common/RoundButton.vue";

import Arrow from "../../../assets/svg/ico-arrow.svg?component";


const mainStore = useMainStore();
const chapterStore = useChapterStore();
</script>

<template>
  <div v-if="chapterStore.currentStep === CHAPTER_STEP.STORY"
       class="fixed top-0 left-0 right-0 bottom-0 col-span-12" style="z-index: 0">
    <img class="w-full h-full object-cover object-center"
         :src="`/chapter/${mainStore.getChapterId}/${chapterStore.data?.sections[mainStore.gameId][chapterStore.currentParagraph]?.image}`"/>
  </div>
  <div v-if="chapterStore.currentStep === CHAPTER_STEP.STORY"
       class="relative col-span-12 sm:col-start-4 sm:col-span-9 lg:col-start-6 lg:col-span-7 bg-white rounded-lg flex items-center gap-6 p-6 mt-auto">
    <div class="w-full h-full flex flex-col items-center justify-center"
         v-html="chapterStore.data?.sections[mainStore.gameId][chapterStore.currentParagraph]?.text">
    </div>
    <RoundButton :color="COLOR.PINK" @click="$emit('next')">
      <Arrow class="rotate-180"/>
    </RoundButton>
  </div>
</template>
