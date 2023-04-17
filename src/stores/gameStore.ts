import {defineStore} from "pinia";
import {STEP} from "../common/Constants";

export type StoreState = {
  currentStep: STEP,
  teamId: number | undefined,
  totalTeams: number,
  totalTeamsFinished: number
};

export const useGameStore = defineStore('game', {
  state: (): StoreState => ({
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
      this.currentStep = STEP.INSTRUCTION;
      this.teamId = undefined;
      this.totalTeams = 0;
      this.totalTeamsFinished = 0;
    }
  }
})