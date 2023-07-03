<template>
  <div ref="cursor" class="cursor w-full h-full px-10 relative flex flex-col justify-between">
    <div ref="canvasContainer" class="canvasContainer w-full relative mb-16" :class="(isError ? 'shake-animation' : '') + (onLoad ? ' opacity-100' : ' opacity-0')">
      <div class="absolute h-full aspect-[75/38] inset-0 m-auto">
        <img src="/game/animations/00103/shadow.png" ref="shadow" class="w-full absolute -bottom-2 scale-[1.05] transition left-0 right-0 mx-auto -z-10" alt="">
      </div>
    </div>
    <div class="relative w-4/5 mx-auto">
      <input ref="range" type="range" v-model="selectedValue.current" min="0" max="4" step="0.001" class="w-full" :class="(isCorrect ? 'correct' : '') + (isError ? 'error' : '')"/>
      <Empty class="absolute -top-24 left-0 -ml-5 bg-green-light w-14 h-14 text-green rounded-full p-4"/>
      <img alt="" :src="'/game/images/00103/' + element + '.png'" class="absolute -top-24 right-0 -mr-5 bg-green-light w-14 h-14 text-green rounded-full p-2">
      <span v-for="i in 5" v-bind="i" class="w-3 h-3 m-1 rounded-full absolute pointer-events-none transition" :style="`left: calc(${(i - 1) * 100 / 4}% - ${(i - 1) * 5}px);`" :class="(isCorrect ? ' bg-blue' : ' bg-purple') + (isError ? ' bg-red' : ' ')" />
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
import { useGameStore } from "../../../../stores/gameStore";
import * as PIXI from "pixi.js";
import RoundButton from '../../../common/RoundButton.vue';
import Check from "../../../../assets/svg/ico-check.svg?component";
import Empty from "../../../../assets/svg/ico-empty.svg?component";
import { COLOR } from '../../../../common/Constants';

export default defineComponent({
  components: {
    RoundButton,
    Check,
    Empty
  },
  emits: ['select'],
  props: {
    element: String,
    isError: Boolean,
    isCorrect: Boolean,
  },
  computed: {
    COLOR() {
      return COLOR
    },
  },
  watch: {
    isCorrect() {
      (this.app.view as HTMLCanvasElement).style.transform = 'translateY(10px)';
      (this.$refs.shadow as HTMLCanvasElement).style.transform = 'scale(1.01)';
      (this.$refs.cursor as HTMLElement).style.opacity = '0';
    }
  },
  data() {
    return {
      gameStore: useGameStore(),
      selectedValue: {
        current: 0,
        target: 0
      },
      onLoad: false,
      targetSprite: 0,
      isClicked: false,
      app: new PIXI.Application({
        autoStart: true,
        width: 750,
        height: 380,
        backgroundAlpha: 0
      }) as PIXI.Application,
      animation: {} as PIXI.AnimatedSprite,
      raf: -1,
    }
  },
  mounted() {
    this.update = this.update.bind(this)
    this.$nextTick(() => {
      (this.$refs.range as HTMLElement).addEventListener('pointerdown', this.click , false);
      (this.$refs.range as HTMLElement).addEventListener('pointerup', this.unClick, false);
        this.raf = requestAnimationFrame(this.update)
    })

    this.loadSprite();
  },
  methods: {
    isLoad() {
      this.onLoad = true;
      (this.app.view as HTMLCanvasElement).style.transform = 'translateY(0px)';
    },
    unClick() {
      this.isClicked = false
    },
    click() {
      this.isClicked = true
    },
    async loadSprite() {
      const time = Date.now()
      const app = this.app;
      (app.view as HTMLCanvasElement).style.width = '60vh';
      (app.view as HTMLCanvasElement).style.margin = 'auto';
      (this.$refs.canvasContainer as HTMLElement).appendChild(app.view as HTMLCanvasElement);
      (app.view as HTMLCanvasElement).style.transform = 'translateY(-50px)';
      (app.view as HTMLCanvasElement).style.transition = 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)';

      const textureData = await PIXI.Assets.load('/game/animations/00103/animation_' + this.element + '.json');
      const animations = textureData.data.animations;

      const animation = PIXI.AnimatedSprite.fromFrames(animations["animation_" + this.element]);

      animation.animationSpeed = 0;
      animation.width = app.view.width;
      animation.height = app.view.height;
      animation.anchor.set(0.5);
      animation.position.set(app.view.width / 2, app.view.height / 2);
      animation.play();

      app.stage.addChild(animation);

      this.animation = animation;
      setTimeout(() => {
        this.isLoad()
      }, Math.max(300 - (Date.now() - time), 0))
    },
    update() {
      this.selectedValue.target = Math.round(this.selectedValue.current)
      if (!this.isClicked) {
        this.selectedValue.current = this.lerp(this.selectedValue.current, this.selectedValue.target, 0.05)
      }
      this.targetSprite = this.getMapSprite(this.selectedValue.current)
      this.animation.animationSpeed = this.true0((this.targetSprite - this.animation.currentFrame) * 0.1, 0.05);
      this.raf = requestAnimationFrame(this.update)
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
    cancelAnimationFrame(this.raf);
    this.app.destroy(true);
    (this.$refs.range as HTMLElement).removeEventListener('pointerdown', this.click , false);
    (this.$refs.range as HTMLElement).removeEventListener('pointerup', this.unClick , false);
  }
})
</script>

<style scoped>
.canvasContainer {
  transition: opacity 0.8s ease-out;
}

.cursor {
  transition: opacity 0.2s ease-out 1s;
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
  background-color: #9B85FF;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  border: 1.5px solid #FFF;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  transform-origin: center;
  transform: scale(3.75);
  transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.error::-webkit-slider-thumb {
  background-color: #FB6F4A !important;
}

.correct::-webkit-slider-thumb {
  background-color: #2BD885 !important;
}

input[type="range"]::-webkit-slider-thumb:hover {
  cursor: grab;
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
  transform-origin: center;
  transform: scale(3.75);
  transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);

}

.error::-moz-range-thumb {
  background-color: #FB6F4A !important;
}

.correct::-moz-range-thumb {
  background-color: #2BD885 !important;
}

input[type="range"]::-moz-range-thumb:hover {
  cursor: grab;
}
</style>
