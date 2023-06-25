<template>
  <div class="bg-texture-beige w-full h-full grid grid-cols-1 sm:grid-cols-12 gap-4 py-6 px-8 flex text-black">
    <Reading v-if="chapterStore.currentStep === CHAPTER_STEP.STORY" @next="next"/>

    <div
        v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION || chapterStore.currentStep === CHAPTER_STEP.END"
        class="relative flex flex-col justify-end items-end sm:col-span-8 lg:col-span-9">
      <div class="absolute w-full aspect-[4/3] -left-8 bottom-0">
        <div class="relative w-full h-full flex">
          <img class="mt-auto" src="/chapter/book.png" alt=""/>
          <div
              class="absolute w-[55%] h-[80%] bottom-[2%] lg:bottom-[8%] right-[12%] -rotate-[3.52deg] flex flex-col items-center justify-center text-center">
            <img class="w-[50%] sm:w-[65%] lg:w-[80%]"
                 :src="`/chapter/${mainStore.getChapterId}/first-page-chapter-${mainStore.getChapterId}.png`" alt=""/>
            <h2 class="font-bold text-green-medium">Chapitre {{ mainStore.chapterId }}</h2>
            <h1 class="font-hand-written text-sm sm:text-md lg:text-xl text-green leading-snug mt-2 lg:mt-6">
              {{ chapterStore.data ? chapterStore.data.title : '' }}</h1>
          </div>
        </div>
      </div>
    </div>

    <div
        v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION || chapterStore.currentStep === CHAPTER_STEP.END"
        class="col-span-4 lg:col-span-3 lg:col-start flex flex-col justify-around items-center">
      <div class="flex flex-col items-center">
        <Connexion class="pb-20" :status-needed="false"/>
        <div class="bg-beige rounded-full p-4 -translate-y-1/2">
          <RoundButton :color="COLOR.PINK" @click="next">
            <Arrow class="rotate-180"/>
          </RoundButton>
        </div>
      </div>
      <CircleButton v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION" @click="openSheet"
                    :text="chapterStore.sheetUnlocked ? 'Ouvrir la fiche' : 'Débloquer la fiche'"
                    :color="COLOR.GREEN_MEDIUM_BEIGE" :size="SIZE.SM" :colorReverse="true">
        <Sheet/>
      </CircleButton>
    </div>
  </div>
  <ModalView v-if="isModalOpen" @close="closeModal" :close="true" :click-outside="true">
    <h1>Fiche connaissance !</h1>
  </ModalView>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useRouter} from "vue-router";
import {getSocket} from "../../../client";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import {useChapterStore} from "../../../stores/chapterStore";
import {GameMasterManagerInstance} from "../../../common/GameMasterManager";
import {CHAPTER_STEP, COLOR, SIZE} from "../../../common/Constants";
import Reading from "./Reading.vue";
import ModalView from "../../common/ModalView.vue";
import RoundButton from "../../common/RoundButton.vue";
import CircleButton from "../../common/CircleButton.vue";
import Connexion from "../../game/teacher/Connexion.vue";

import Arrow from "../../../assets/svg/ico-arrow.svg?component";
import Sheet from "../../../assets/svg/ico-book.svg?component";

export default defineComponent({
  name: 'TeacherChapter',
  components: {Arrow, CircleButton, Connexion, ModalView, Reading, RoundButton, Sheet},
  data() {
    return {
      step: 0,
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      chapterStore: useChapterStore(),
      GMInstance: GameMasterManagerInstance,
      router: useRouter(),
      isModalOpen: false
    }
  },
  computed: {
    SIZE() {
      return SIZE
    },
    COLOR() {
      return COLOR
    },
    CHAPTER_STEP() {
      return CHAPTER_STEP
    },
    totalParts() {
      return this.chapterStore.data?.sections.length;
    },
    totalTexts() {
      return this.chapterStore.data?.sections[this.mainStore.gameId].length;
    }
  },
  methods: {
    next() {
      switch (this.chapterStore.currentStep) {
        case CHAPTER_STEP.INTRODUCTION:
          this.GMInstance.startChapter();
          this.chapterStore.currentStep = CHAPTER_STEP.STORY;
          break;
        case CHAPTER_STEP.STORY:
          if (this.chapterStore.currentParagraph < this.totalTexts - 1) {
            this.chapterStore.currentParagraph += 1;
            this.GMInstance.nextParagraph();
            break;
          } else {
            if (this.mainStore.gameId < this.totalParts - 1) {
              this.mainStore.gameId += 1;
              this.GMInstance.launchGame(this.mainStore.gameId)
              break;
            } else {
              this.chapterStore.currentStep = CHAPTER_STEP.END;
              break;
            }
          }
        case CHAPTER_STEP.END:
          this.GMInstance.endChapter();
      }
    },
    openSheet() {
      if (this.chapterStore.sheetUnlocked) {
        this.isModalOpen = true;
        this.mainStore.isModalOpen = true;
      } else {
        this.router.push('/scan');
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.mainStore.isModalOpen = false;
    }
  }
});
</script>
