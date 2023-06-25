<template>
  <div class="relative w-full h-full flex flex-col items-center text-center px-8"
       :class="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION ? 'bg-texture-beige' : 'bg-texture-green'">
    <CircleButton v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION && !chapterStore.sheetUnlocked"
                  @click="router.push('/scan')" class="absolute top-12 right-8"
                  text="Scanner tes missions" :color="COLOR.YELLOW" :size="SIZE.SM" :colorReverse="true">
      <Camera/>
    </CircleButton>
    <span v-if="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION" class="absolute top-1/2 -translate-y-[200%] heading-1 text-center ">Vous serez l'équipe :</span>
    <TeamSignboard v-if="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION" class="absolute bottom-0 left-1/2 -translate-x-1/2 text-xl" height="50%"/>
    <Info class="absolute bottom-2 sm:bottom-6 lg:bottom-12 left-1/2 -translate-x-1/2"
          :text="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION ?
        'Un peu de patience ... L’histoire va bientôt commencer' :
         'Lecture du chapitre sur les carottes en cours...'">
      <Loading class="loading-animation w-8 aspect-square"/>
    </Info>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../../../client";
import {useChapterStore} from "../../../stores/chapterStore";
import {CHAPTER_STEP, COLOR, SIZE} from "../../../common/Constants";
import Info from "../../common/Info.vue";
import CircleButton from "../../common/CircleButton.vue";
import RoundButton from "../../common/RoundButton.vue";

import Camera from "../../../assets/svg/ico-camera.svg?component";
import Loading from "../../../assets/svg/ico-loading.svg?component";
import TeamSignboard from "../../common/TeamSignboard.vue";

export default defineComponent({
  name: 'InGame',
  computed: {
    SIZE() {
      return SIZE
    },
    CHAPTER_STEP() {
      return CHAPTER_STEP
    },
    COLOR() {
      return COLOR
    }
  },
  components: {TeamSignboard, Info, CircleButton, RoundButton, Camera, Loading},
  emits: ['validated'],
  data() {
    return {
      socket: getSocket(),
      router: useRouter(),
      chapterStore: useChapterStore()
    }
  },
  mounted() {
  },
  methods: {
    validated() {
      this.$emit('validated');
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
