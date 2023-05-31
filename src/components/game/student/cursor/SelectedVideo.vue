<template>
  <div class="fixed w-full mt-20">
    <div ref="canvasContainer"></div>
    <input ref="range" type="range" v-model="selectedValue.current" min="0" max="5" step="0.001" class="w-2/3" />
    <RoundButton :color="COlOR.GREEN" @click="select">
      <Check />
    </RoundButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as PIXI from "pixi.js";
import RoundButton from '../../../common/RoundButton.vue';
import Check from "../../../../assets/svg/ico-check.svg?component";
import { COlOR } from '../../../../common/Constants';

export default defineComponent({
  component: {
    RoundButton,
    Check
  },
  emits: ['select'],
  computed: {
    COlOR() {
      return COlOR
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
        width: 800,
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
      (this.$refs.canvasContainer as HTMLElement).appendChild(app.view);

      const textureData = await PIXI.Assets.load('/src/assets/cursor-game-videos/animation_texture.json');
      const animations = textureData.data.animations;

      const animation = PIXI.AnimatedSprite.fromFrames(animations["animation_texture"]);

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
      this.animation.animationSpeed = (this.targetSprite - this.animation.currentFrame) * 0.1;
    },
    getMapSprite(n: number) {
      return (n / 5) * (this.animation.totalFrames - 1)
    },
    lerp(start:number, end:number, t:number):number {
      return start * (1 - t) + end * t;
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
  width: 100%;
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
  border-radius: 50%;
  height: 60px;
  width: 60px;
  border: 3px solid #FFF;
  box-shadow: 0px 3px 3px 5px rgba(0,0,0,0);
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
  border-radius: 50%;
  height: 60px;
  width: 60px;
  border: 3px solid #FFF;
  box-shadow: 0px 3px 3px 5px rgba(0,0,0,0);
}
</style>
