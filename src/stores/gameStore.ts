import {defineStore} from "pinia";
import {STEP} from "../common/Constants";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {state} from "vue-tsc/out/shared";

export type StoreState = {
  data: any | undefined,
  currentStep: STEP,
  teamId: number | undefined,
  totalTeams: number,
  totalTeamsFinished: number,
  currentPart: number
};

export const useGameStore = defineStore('game', {
  state: (): StoreState => ({
    data: undefined,
    currentStep: STEP.INSTRUCTION,
    teamId: undefined,
    totalTeams: 0,
    totalTeamsFinished: 0,
    currentPart: 0
  }),
  getters: {
    gameFinished(): boolean {
      return this.totalTeamsFinished === this.totalTeams;
    }
  },
  actions: {
    reset() {
      this.currentStep = STEP.INSTRUCTION;
      this.totalTeamsFinished = 0;
      this.currentPart = 0;
    },
  }
})
