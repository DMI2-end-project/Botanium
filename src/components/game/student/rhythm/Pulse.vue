<template>
  <div class="flex justify-center items-center relative">

    <div class="absolute aspect-square h-[160%] bg-white rounded-full shadow-lg"></div>
    <div class="absolute aspect-square h-[200%] bg-white/20 rounded-full"></div>
    <div ref="canvasContainer" class="canvas w-full" :style="'filter: hue-rotate( ' + colors[color] + 'deg)'" />
    <!-- :style="'filter: hue-rotate( ' + colors[color] + 'deg)'" -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as PIXI from "pixi.js";

interface Colors {
  [key: string]: any;
}

export default defineComponent({
  name: "PulseElement",
  data() {
    return {
      pulse: false,
      colors: {
        'purple' : 0,
        'red' : 100,
        'green' : -100,
      } as Colors,
      app: new PIXI.Application({
        autoStart: true,
        width: 250,
        height: 250,
        backgroundAlpha: 0
      }) as PIXI.Application,
      animation: {} as PIXI.AnimatedSprite,
    };
  },
  props: {
    color: {
      default: 'purple', // purple red green
      type: String
    }
  },
  mounted() {
    this.loadSprite()
  },
  methods: {
    startAnimation() {
      if (this.animation.isSprite) {
        this.animation.gotoAndPlay(7)
      }
    },
    async loadSprite() {
      const app = this.app;
      (app.view as HTMLCanvasElement).style.width = '25vh';
      (app.view as HTMLCanvasElement).style.margin = 'auto';
      (this.$refs.canvasContainer as HTMLElement).appendChild(app.view as HTMLCanvasElement);

      const textureData = await PIXI.Assets.load('/game/animations/00104/animation_hands.json');
      const animations = textureData.data.animations;

      const animation = PIXI.AnimatedSprite.fromFrames(animations["hands"]);

      animation.animationSpeed = 0.65;
      animation.width = app.view.width;
      animation.height = app.view.height;
      animation.anchor.set(0.5);
      animation.position.set(app.view.width / 2, app.view.height / 2);

      app.stage.addChild(animation);

      this.animation = animation
    },
  }
});
</script>

<style scoped>
.canvas {
  transition: filter 0.15s ease-out;
}
</style>
