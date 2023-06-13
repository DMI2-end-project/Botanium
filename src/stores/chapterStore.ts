import {defineStore} from "pinia";
import {CHAPTER_STEP} from "../common/Constants";

export type StoreState = {
  data: any | undefined,
  currentStep: CHAPTER_STEP,
  // currentSection: number, --> based on / same as mainStore.gameId
  currentParagraph: number,
  tasksScanned: number
  nbrTasks: number,
};

export const useChapterStore = defineStore('chapter', {
  state: (): StoreState => ({
    data: undefined,
    currentStep: CHAPTER_STEP.IDLE,
    // currentSection: 0,
    currentParagraph: 0,
    tasksScanned: 0,
    nbrTasks: 3
  }),
  getters: {},
  actions: {
    reset() {
      this.currentStep = CHAPTER_STEP.IDLE;
      this.tasksScanned = 0;
    },
  }
})