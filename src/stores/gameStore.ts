import {defineStore} from "pinia";
import {GAME_STEP} from "../common/Constants";

export type StoreState = {
  data: any | undefined,
  teamId: number | undefined,
  teamName: string | undefined,
  teams: any[],
  currentStep: GAME_STEP,
  currentSequence: number
};

export const useGameStore = defineStore('game', {
  state: (): StoreState => ({
    data: undefined,
    teamId: undefined,
    teamName: undefined,
    teams: [],
    currentStep: GAME_STEP.IDLE,
    currentSequence: 0
  }),
  actions: {
    reset() {
      this.teams = [];
      this.currentStep = GAME_STEP.IDLE;
      this.currentSequence = 0;
    },
  }
});
