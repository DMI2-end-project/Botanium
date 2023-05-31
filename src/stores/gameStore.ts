import {defineStore} from "pinia";
import {GAME_STEP} from "../common/Constants";

export type StoreState = {
  data: any | undefined,
  currentStep: GAME_STEP,
  teamId: number | undefined,
  teamName: string | undefined,
  totalTeams: number,
  totalTeamsFinished: number,
  currentSequence: number
};

export const useGameStore = defineStore('game', {
  state: (): StoreState => ({
    data: undefined,
    currentStep: GAME_STEP.INSTRUCTION,
    teamId: undefined,
    teamName: undefined,
    totalTeams: 0,
    totalTeamsFinished: 0,
    currentSequence: 0
  }),
  getters: {
    gameFinished(): boolean {
      return this.totalTeamsFinished === this.totalTeams;
    }
  },
  actions: {
    reset() {
      this.currentStep = GAME_STEP.INSTRUCTION;
      this.totalTeamsFinished = 0;
      this.currentSequence = 0;
    },
  }
})
