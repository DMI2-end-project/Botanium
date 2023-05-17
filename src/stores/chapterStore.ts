import {defineStore} from "pinia";
import {CHAPTER_STEP} from "../common/Constants";

export type StoreState = {
  data: any | undefined,
  currentStep: CHAPTER_STEP,
  currentSection: number,
  currentParagraph: number
};

export const useChapterStore = defineStore('chapter', {
  state: (): StoreState => ({
    data: undefined,
    currentStep: CHAPTER_STEP.INTRODUCTION,
    currentSection: 0,
    currentParagraph: 0
  }),
  getters: {
  },
  actions: {
    reset() {
      this.currentStep = CHAPTER_STEP.INTRODUCTION;
    },
  }
})