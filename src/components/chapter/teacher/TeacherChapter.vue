<template>
  <div class="grid grid-cols-12 gap-4 px-8 flex p-6 text-black">
    <Reading v-show="chapterStore.currentStep === CHAPTER_STEP.STORY" class="col-span-12"/>
    <div
        v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION || chapterStore.currentStep === CHAPTER_STEP.END"
        class="col-span-9 bg-beige rounded-md p-6">
      <h1>Chapitre {{ mainStore.chapterId }}</h1>
      <h2>Capucine Pinpin et les carottes</h2>
    </div>
    <div class="col-span-3">
      <!-- TODO : add connexion -->
      <RoundButton :color="COLOR.PINK" @click="next">
        <Arrow class="rotate-180"/>
      </RoundButton>
      <RoundButton v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION"
                   :color="COLOR.YELLOW"
                   @click="openSheet">
        <Sheet/>
      </RoundButton>
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
import {CHAPTER_STEP, COLOR} from "../../../common/Constants";
import Reading from "./Reading.vue";
import ModalView from "../../common/ModalView.vue";
import RoundButton from "../../common/RoundButton.vue";

import Arrow from "../../../assets/svg/ico-arrow.svg?component";
import Sheet from "../../../assets/svg/ico-book.svg?component";

export default defineComponent({
  name: 'TeacherChapter',
  components: {ModalView, Arrow, RoundButton, Reading, Sheet},
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
