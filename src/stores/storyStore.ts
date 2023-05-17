import {defineStore} from "pinia";
import {STORYSTEP} from "../common/Constants";

export type StoreState = {
  data: any | undefined,
  currentStep: STORYSTEP,
  currentPart: number,
  currentText: number
};

export const useStoryStore = defineStore('story', {
  state: (): StoreState => ({
    data: undefined,
    currentStep: STORYSTEP.INTRODUCTION,
    currentPart: 0,
    currentText: 0
  }),
  getters: {
  },
  actions: {
    reset() {
      this.currentStep = STORYSTEP.INTRODUCTION;
    },
  }
})