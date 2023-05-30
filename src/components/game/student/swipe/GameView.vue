<script lang="ts" setup>
import {onMounted, ref} from "vue";
import * as PIXI from "pixi.js";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";

let canvas = ref<HTMLCanvasElement | null>(null);
let width = 200;
let height = 390;

onMounted(() => {
  console.log('SWIPE');

  if (canvas.value) {
    let app = new PIXI.Application({
      resolution: window.devicePixelRatio,
      width: width,
      height: height,
      autoStart: true,
      view: canvas.value,
      backgroundAlpha: 0,
    });

    // TODO : points from json
    let soilZone = new PIXI.Polygon([
      65, 120,
      140, 120,
      110, 380,
      90, 350,
      70, 300,
    ]);

    /*
    let soilGraphic = new PIXI.Graphics();
    soilGraphic.beginFill(0XFF0000, 0.5);
    soilGraphic.drawPolygon(soilZone.points);
    soilGraphic.endFill();
    app.stage.addChild(soilGraphic);
    */

    // TODO : make it reactive to listen to empty array
    let sprites: PIXI.Sprite[] = []
    for (let i = 0; i < 300; i++) {
      let sprite = PIXI.Sprite.from('/src/assets/game-data/images/00102/soil-v2.png');
      // TODO : create Tween

      sprite.anchor.set(0.5);
      sprite.scale.set(0.3, 0.3);

      let x = 0;
      let y = 0;

      while (!soilZone.contains(x, y)) {
        x = Math.random() * width
        y = Math.random() * height
      }
      sprite.position.set(x, y);

      app.stage.addChild(sprite);
      sprites.push(sprite);

      sprite.eventMode = 'dynamic';

      sprite.on('pointerover', () => {
        sprite.removeFromParent();
        sprite.destroy();
        sprites = sprites.filter(s => s !== sprite);
      });
    }
  }
});
</script>

<template>
  <div>
    <div class="w-full h-full bg-green-medium grid grid-cols-12 gap-4 px-8 text-center gap-5">
      <div class="relative aspect-[5/9] col-span-4 col-start-5">
        <img src="../assets/game-data/images/00102/amphine.png" class="w-full h-full object-contain"/>
        <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full border-4 border-pink"/>
      </div>
    </div>
    <!--button @click="$emit('validated');">Reussi</button-->
  </div>
</template>