<template>
  <div class="bg-gray-100 flex p-6 text-black">
    <div v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION || chapterStore.currentStep === CHAPTER_STEP.END"
         class="bg-beige rounded-md p-6">
      <h1>Chapitre {{ mainStore.chapterId }}</h1>
      <h2>Capucine Pinpin et les carottes</h2>
    </div>
    <Reading v-show="chapterStore.currentStep === CHAPTER_STEP.STORY" :data="$props.data"/>
    <RoundButton :color="COLOR.PINK" @click="next"> ></RoundButton>

    <!--div class="flex flex-col">
      <button>Projection</button>
      <button @click="launchGame">
        Lancer l'exercice {{ mainStore.gameId + 1 }}
      </button>
    </div-->
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {COLOR, CHAPTER_STEP} from "../../../common/Constants";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import Reading from "./Reading.vue";
import {GameMasterManagerInstance} from "./../../../common/GameMasterManager";
import RoundButton from "../../common/RoundButton.vue";
import {useChapterStore} from "../../../stores/chapterStore";

export default defineComponent({
  name: 'TeacherChapter',
  components: {RoundButton, Reading},
  props: {
    data: Object
  },
  data() {
    return {
      step: 0,
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      chapterStore: useChapterStore(),
      GMIntsance: GameMasterManagerInstance
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
      return this.$props.data?.sections.length;
    },
    totalTexts() {
      return this.$props.data?.sections[this.mainStore.gameId].length;
    }
  },
  methods: {
    next() {
      switch (this.chapterStore.currentStep) {
        case CHAPTER_STEP.INTRODUCTION:
          this.GMIntsance.startChapter();
          this.chapterStore.currentStep = CHAPTER_STEP.STORY;
          break;
        case CHAPTER_STEP.STORY:
          if (this.chapterStore.currentParagraph < this.totalTexts - 1) {
            this.chapterStore.currentParagraph += 1;
            break;
          } else {
            if (this.mainStore.gameId < this.totalParts - 1) {
              this.GMIntsance.launchGame(this.mainStore.gameId + 1)
              break;
            } else {
              this.chapterStore.currentStep = CHAPTER_STEP.END;
              break;
            }
          }
        case CHAPTER_STEP.END:
          this.GMIntsance.endChapter();
      }
    }
  }
});
</script>
