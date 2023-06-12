import {defineStore} from "pinia";
import { GAME_STEP } from "../common/Constants";
import * as PIXI from "pixi.js";

interface Animations {
  [key: string]: any;
}

export type StoreState = {
  data: any | undefined,
  teamId: number | undefined,
  teamName: string | undefined,
  teams: any[],
  currentStep: GAME_STEP,
  currentSequence: number
  // animations00103: Animations,
};

export const useGameStore = defineStore('game', {
  state: (): StoreState => ({
    data: undefined,
    teamId: undefined,
    teamName: undefined,
    teams: [],
    currentStep: GAME_STEP.IDLE,
    currentSequence: 0,
    // animations00103: {
    //   rock: { url: '/game/animations/00103/animation_rock.json', frames: 'animation_rock', animation: null},
    //   sun: { url: '/game/animations/00103/animation_sun.json', frames: 'animation_sun', animation: null},
    //   height: { url: '/game/animations/00103/animation_height.json', frames: 'animation_height', animation: null},
    //   texture: { url: '/game/animations/00103/animation_texture.json', frames: 'animation_texture', animation: null},
    // }
  }),
  actions: {
    // async preloadAnimations() {
    //   if (this.animations00103['rock'].animation) return
    //   await Object.values(this.animations00103).forEach(async element => {

    //     const textureData = await PIXI.Assets.load(element.url);
    //     const animations = textureData.data.animations;

    //     const animation = PIXI.AnimatedSprite.fromFrames(animations[element.frames]);
    //     element.animation = animation;
    //   });
    //   console.log(this.animations00103)
    // },
    reset() {
      this.teams = [];
      this.currentStep = GAME_STEP.IDLE;
      this.currentSequence = 0;
    },
  }
});
