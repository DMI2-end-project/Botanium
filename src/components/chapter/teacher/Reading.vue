<script setup lang="ts">
import {useChapterStore} from "../../../stores/chapterStore";
import {useMainStore} from "../../../stores/mainStore";
import {CHAPTER_STEP, COLOR} from "../../../common/Constants";
import RoundButton from "../../common/RoundButton.vue";
import {computed, onBeforeMount, Ref, ref, watch} from "vue";

import Arrow from "../../../assets/svg/ico-arrow.svg?component";


const mainStore = useMainStore();
const chapterStore = useChapterStore();
const images = ref<string[]>([]);
images.value.push(`/chapter/${mainStore.getChapterId}/${chapterStore.data?.sections[mainStore.gameId][chapterStore.currentParagraph]?.image}`);

const texts = ref<string[]>([]);
texts.value.push(chapterStore.data?.sections[mainStore.gameId][chapterStore.currentParagraph]?.text);


chapterStore.$subscribe((_, state) => {
  if (state.currentParagraph) {
    const image = `/chapter/${mainStore.getChapterId}/${chapterStore.data?.sections[mainStore.gameId][chapterStore.currentParagraph]?.image}`
    const text = chapterStore.data?.sections[mainStore.gameId][chapterStore.currentParagraph]?.text
    if (image !== images.value[images.value.length - 1]) {
      images.value.push(image)

      setTimeout(() => {
        if (images.value.length > 1) {
          images.value.shift()
        }
      }, 1200)
    }

    if (text !== texts.value[texts.value.length - 1]) {
      texts.value.push(text)

      setTimeout(() => {
        if (texts.value.length > 1) {
          texts.value.shift()
        }
      }, 600)
    }
  }
});

</script>

<template>
  <div v-if="chapterStore.currentStep === CHAPTER_STEP.STORY"
       class="fixed top-0 left-0 right-0 bottom-0 col-span-12" style="z-index: 0">
    <img class="w-full h-full object-cover object-center z-10" :src="images[0]"/>
    <Transition name="texture">
      <img v-show="images.length > 1" class="w-full h-full object-cover object-center absolute inset-0"
           :src="images[1]"/>
    </Transition>

  </div>

  <Transition name="slide">
    <div v-if="chapterStore.currentStep === CHAPTER_STEP.STORY" v-show="texts.length <= 1"
         class="absolute m-6 md:w-2/3 w-3/4 bottom-0 right-0 bg-beige rounded-lg flex items-center gap-6 p-6 mt-auto">
      <p class="w-full h-full flex flex-col justify-center text-green font-bold"
         v-html="texts[0]"/>
      <RoundButton :color="COLOR.PINK" @click="$emit('next')">
        <Arrow class="rotate-180"/>
      </RoundButton>
    </div>
  </Transition>
</template>
