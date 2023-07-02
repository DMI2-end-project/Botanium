<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="absolute aspect-[1.77] min-w-[100vw] min-h-[100vh] flex items-center justify-center">
      <div ref="canvasContainer" class="canvas w-full translate-y-[9vh] translate-x-[11%]" />
    </div>
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
        width: 256,
        height: 358,
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
  async mounted() {
    await this.loadSprite()
    this.animation.play()
  },
  methods: {
    async loadSprite() {
      const app = this.app;
      (app.view as HTMLCanvasElement).style.width = '12%';
      (app.view as HTMLCanvasElement).style.margin = 'auto';
      (this.$refs.canvasContainer as HTMLElement).appendChild(app.view as HTMLCanvasElement);

      const textureData = await PIXI.Assets.load('/home/animation/animation_capu.json');
      const animations = textureData.data.animations;

      const animation = PIXI.AnimatedSprite.fromFrames(animations["capu_01"]);

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
