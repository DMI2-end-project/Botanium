<template>
  <div class="flex justify-center items-center relative">
    <div ref="canvasContainer" class="w-full -my-20"></div>
    <!-- <div class="animate-circle rounded-full relative">
      <div :style="pulse ?
      'transform: scale(1); opacity: 1;' :
      'transform: scale(1.4); opacity: 0.6;'
      " class="h-60 w-60 rounded-full bg-white absolute inset-0 m-auto"></div>
      <div :style="pulse ?
      'transform: scale(1)' :
      'transform: scale(1);'
      " class="h-60 w-60 rounded-full bg-purple inset-0 m-auto"></div>
    </div>
    <p :style="pulse ? 'transform: scale(1); opacity: 1;' : 'transform: scale(0.9); opacity: 0;'" class=" animate-text absolute text-white text-xl">
      Clap !
    </p> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as PIXI from "pixi.js";

export default defineComponent({
  name: "PulseElement",
  data() {
    return {
      pulse: false,
      app: new PIXI.Application({
        autoStart: true,
        width: 850,
        height: 600,
        backgroundAlpha: 0
      }) as PIXI.Application,
      animation: {} as PIXI.AnimatedSprite,
    };
  },
  watch: {
    pulse() {
      // console.log(this.pulse)
    }
  },
  mounted() {
    this.loadSprite()
  },
  methods: {
    startAnimation() {
      if (this.animation.isSprite) {
        console.log(0, this.animation.currentFrame)
        this.animation.gotoAndPlay(0)
      }
    },
    async loadSprite() {
      const app = this.app;
      (app.view as HTMLCanvasElement).style.width = '100vh';
      (app.view as HTMLCanvasElement).style.margin = 'auto';
      (this.$refs.canvasContainer as HTMLElement).appendChild(app.view as HTMLCanvasElement);

      const textureData = await PIXI.Assets.load('/src/assets/game-data/animations/00104/animation_clap.json');
      const animations = textureData.data.animations;

      const animation = await PIXI.AnimatedSprite.fromFrames(animations["animation_clap"]);

      animation.animationSpeed = 0.51;
      animation.width = app.view.width;
      animation.height = app.view.height;
      animation.anchor.set(0.5);
      animation.position.set(app.view.width / 2, app.view.height / 2);

      app.stage.addChild(animation);

      this.animation = animation

      // this.app.ticker.add(this.update)
    },
  }
});
</script>

<style scoped>

.animate-circle > div {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in-out;;
}

.animate-text {
  transform: scale(0.9);
  opacity: 0;
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
</style>
