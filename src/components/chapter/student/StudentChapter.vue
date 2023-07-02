<template>
  <div class="relative w-full h-full flex flex-col items-center text-center px-8">
    <img class="absolute w-full h-full object-cover object-center"
         v-if="chapterStore.currentStep === CHAPTER_STEP.STORY" src="/chapter/chapter.svg"/>

    <CircleButton v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION && !chapterStore.sheetUnlocked"
                  @click="router.push('/scan')" class="absolute top-12 right-8"
                  text="Scanner tes missions" :color="COLOR.YELLOW" :size="SIZE.SM" :colorReverse="true">
      <Camera/>
    </CircleButton>
    <span v-if="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION"
          class="absolute top-1/2 -translate-y-[200%] heading-1 text-center ">Vous serez l'équipe :</span>
    <TeamSignboard v-if="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION"
                   class="absolute bottom-0 left-1/2 -translate-x-1/2 text-xl" height="50%"/>
    <Info class="absolute bottom-2 sm:bottom-6 lg:bottom-12 left-1/2 -translate-x-1/2 z-10"
          :text="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION ?
        'Un peu de patience ... L’histoire va bientôt commencer' :
         'Lecture du chapitre sur les carottes en cours...'">
      <Loading class="loading-animation w-8 aspect-square"/>
    </Info>

    <AnimatedFoliage :show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION"/>
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
import TeamSignboard from "../../common/TeamSignboard.vue";
import AnimatedFoliage from "../../AnimatedFoliage.vue";

import Camera from "../../../assets/svg/ico-camera.svg?component";
import Loading from "../../../assets/svg/ico-loading.svg?component";
import Background from "../../../assets/svg/bg-chapter.svg?component";

export default defineComponent({
  name: 'InGame',
  computed: {
    CHAPTER_STEP() {
      return CHAPTER_STEP
    },
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    }
  },
  components: {AnimatedFoliage, Background, Camera, CircleButton, Info, Loading, RoundButton, TeamSignboard},
  emits: ['validated'],
  data() {
    return {
      chapterStore: useChapterStore(),
      router: useRouter(),
      socket: getSocket(),
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

<style scoped>
.organic-1 {
  animation: organic 18s ease infinite;
}

.organic-2 {
  animation: organic 15s ease infinite 0.2s;
}

.organic-3 {
  animation: organic 19s ease infinite 0.1s;
}

.organic-4 {
  animation: organic 20s ease infinite 0.4s;
}

.organic-5 {
  animation: organic 24s ease infinite 0.1s;
}

@keyframes organic {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(1.2deg);
  }
  50% {
    transform: rotate(-0.3deg);
  }
  75% {
    transform: rotate(0.5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.bgTransitionLeft1-enter-from,
.bgTransitionLeft1-leave-to,
.bgTransitionLeft2-enter-from,
.bgTransitionLeft2-leave-to {
  transform: scaleX(1.2) translate(-200px, 30px) rotate(-50deg);
  opacity: 0;
}

.bgTransitionRight1-enter-from,
.bgTransitionRight1-leave-to,
.bgTransitionRight2-enter-from,
.bgTransitionRight2-leave-to {
  transform: scaleX(1.2) translate(200px, 30px) rotate(50deg);
  opacity: 0;
}

.bgTransitionLeft1-enter-active,
.bgTransitionRight1-enter-active {
  transition: transform 1.2s cubic-bezier(0.445, 1.375, 0.305, 1.000),
  opacity 0.2s ease-out;
}

.bgTransitionLeft2-enter-active,
.bgTransitionRight2-enter-active {
  transition: transform 1.2s cubic-bezier(0.445, 1.375, 0.305, 1.000) 0.2s,
  opacity 0.2s ease-out 0.2s;
}

.bgTransitionLeft1-leave-active,
.bgTransitionRight1-leave-active {
  transition: transform 0.9s cubic-bezier(0.36, 0, 0.66, -0.56) 0.2s,
  opacity 0.2s ease-in 0.9s;
}

.bgTransitionLeft2-leave-active,
.bgTransitionRight2-leave-active {
  transition: transform 0.9s cubic-bezier(0.36, 0, 0.66, -0.56),
  opacity 0.2s ease-in 0.7s;
}

</style>