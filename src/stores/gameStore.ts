import {defineStore} from "pinia";
import {STEP} from "../common/Constants";

export type StoreState = {
  data: any | undefined,
  currentStep: STEP,
  teamId: number | undefined,
  totalTeams: number,
  totalTeamsFinished: number
};

export const useGameStore = defineStore('game', {
  state: (): StoreState => ({
    data: undefined,
    currentStep: STEP.INSTRUCTION,
    teamId: undefined,
    totalTeams: 0,
    totalTeamsFinished: 0
  }),
  getters: {
    gameFinished(): boolean {
      return this.totalTeamsFinished === this.totalTeams;
    }
  },
  actions: {
    reset() {
      this.data = undefined;
      this.currentStep = STEP.INSTRUCTION;
      this.teamId = undefined;
      this.totalTeams = 0;
      this.totalTeamsFinished = 0;
    }
  }
})