<template>
  <div class="flex justify-center items-center relative">
    <div ref="canvasContainer" class="canvas w-full -my-20" :style="'filter: hue-rotate( ' + colors[color] + 'deg)'" ></div>
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
        width: 850,
        height: 600,
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
        this.animation.gotoAndPlay(4)
      }
    },
    async loadSprite() {
      const app = this.app;
      (app.view as HTMLCanvasElement).style.width = '100vh';
      (app.view as HTMLCanvasElement).style.margin = 'auto';
      (this.$refs.canvasContainer as HTMLElement).appendChild(app.view as HTMLCanvasElement);

      const textureData = await PIXI.Assets.load('/game/animations/00104/animation_clap.json');
      const animations = textureData.data.animations;

      const animation = await PIXI.AnimatedSprite.fromFrames(animations["animation_clap"]);

      animation.animationSpeed = 0.35;
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
