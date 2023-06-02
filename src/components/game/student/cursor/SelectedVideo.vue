<template>
  <div class="w-full h-full px-10 relative flex flex-col justify-between">
    <div ref="canvasContainer" class="w-full -my-20"></div>
    <div class="relative w-4/5 mx-auto">
      <input ref="range" type="range" v-model="selectedValue.current" min="0" max="4" step="0.001" class="w-full"/>
      <img :src="'/src/assets/game-data/images/00103/' + element + '-0.png'" class="absolute -top-24 left-0 w-14 -ml-5">
      <img :src="'/src/assets/game-data/images/00103/' + element + '-1.png'" class="absolute -top-24 right-0 w-14 -mr-5">
      <span v-for="i in 5" v-bind="i" class="w-3 h-3 m-1 bg-purple rounded-full absolute pointer-events-none" :style="`left: calc(${(i - 1) * 100 / 4}% - ${(i - 1) * 5}px);`" />
    </div>
    <div class="absolute top-[45%] right-10">
      <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" @click="select" class="">
      <Check />
    </RoundButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as PIXI from "pixi.js";
import RoundButton from '../../../common/RoundButton.vue';
import Check from "../../../../assets/svg/ico-check.svg?component";
import { COLOR } from '../../../../common/Constants';

export default defineComponent({
  components: {
    RoundButton,
    Check
  },
  emits: ['select'],
  props: {
    element: String
  },
  computed: {
    COLOR() {
      return COLOR
    },
  },
  data() {
    return {
      selectedValue: {
        current: 0,
        target: 0
      },
      targetSprite: 0,
      isClicked: false,
      app: new PIXI.Application({
        autoStart: true,
        width: 850,
        height: 600,
        backgroundAlpha: 0
      }) as PIXI.Application,
      animation: {} as PIXI.AnimatedSprite,
    }
  },
  mounted() {
    this.update = this.update.bind(this)
    this.loadSprite();
    (this.$refs.range as HTMLElement).addEventListener('pointerdown', this.click , false);
    (this.$refs.range as HTMLElement).addEventListener('pointerup', this.unClick , false);
  },
  methods: {
    unClick() {
      this.isClicked = false
    },
    click() {
      this.isClicked = true
    },
    async loadSprite() {
      const app = this.app;
      (app.view as HTMLCanvasElement).style.width = '100vh';
      (app.view as HTMLCanvasElement).style.margin = 'auto';
      (this.$refs.canvasContainer as HTMLElement).appendChild(app.view as HTMLCanvasElement);

      const textureData = await PIXI.Assets.load('/src/assets/game-data/animations/00103/animation_' + this.element + '.json');
      const animations = textureData.data.animations;

      const animation = PIXI.AnimatedSprite.fromFrames(animations["animation_" + this.element]);

      animation.animationSpeed = 0;
      animation.width = app.view.width;
      animation.height = app.view.height;
      animation.anchor.set(0.5);
      animation.position.set(app.view.width / 2, app.view.height / 2);
      animation.play();

      app.stage.addChild(animation);

      this.animation = animation

      this.app.ticker.add(this.update)
    },
    update() {
      this.selectedValue.target = Math.round(this.selectedValue.current)
      if (!this.isClicked) {
        this.selectedValue.current = this.lerp(this.selectedValue.current, this.selectedValue.target, 0.05)
      }
      this.targetSprite = this.getMapSprite(this.selectedValue.current)
      console.log(this.animation.animationSpeed)
      this.animation.animationSpeed = this.true0((this.targetSprite - this.animation.currentFrame) * 0.1, 0.05);
    },
    getMapSprite(n: number) {
      return (n / 4) * (this.animation.totalFrames - 1)
    },
    lerp(start:number, end:number, t:number):number {
      return start * (1 - t) + end * t;
    },
    approximatelyEqual(n1:number, n2:number, precision:number):boolean {
      return (n1 + precision > n2 && n1 - precision < n2)
    },
    true0(n: number, precision:number):number {
      return (this.approximatelyEqual(n, 0, precision) ? 0 : n)
    },
    select() {
      this.$emit('select', this.selectedValue.target);
    }
  },
  beforeUnmount() {
    this.app.ticker.remove(this.update);
    this.app.destroy(true);
  }
})
</script>

<style scoped>
#canvasContainer {
  display: block;
  width: 100%;
  height: 100%;
}

/*********** Baseline, reset styles ***********/
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

/* Removes default focus */
input[type="range"]:focus {
  outline: none;
}

/******** Chrome, Safari, Opera and Edge Chromium styles ********/
/* slider track */
input[type="range"]::-webkit-slider-runnable-track {
  background-color: #FFF;
  border-radius: 18px;
  height: 18px;
}

/* slider thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  margin-top: -21px; /* Centers thumb on the track */
  background-color: #9B85FF;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  border: 1.5px solid #FFF;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  transform: scale(3.75);
}

/*********** Firefox styles ***********/
/* slider track */
input[type="range"]::-moz-range-track {
  background-color: #FFF;
  border-radius: 18px;
  height: 18px;
}

/* slider thumb */
input[type="range"]::-moz-range-thumb {
  background-color: #9B85FF;
  border: none; /*Removes extra border that FF applies*/
  height: 16px;
  width: 16px;
  border-radius: 50%;
  border: 1.5px solid #FFF;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  transform: scale(3.75);
}
</style>
