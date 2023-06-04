<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {Application, Graphics, Polygon, Sprite} from "pixi.js";
import {gsap} from "gsap";

import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";

import ModalView from "../components/common/ModalView.vue";
import RoundButton from "../components/common/RoundButton.vue";
import {TeamManagerInstance} from "../common/TeamManager";

const mainStore = useMainStore();
const gameStore = useGameStore();

const teamData = ref<any>(null);

let canvas = ref<HTMLCanvasElement | null>(null);
let width = 200;
let height = 390;

const sprites = ref<Sprite[]>([]);

const isModalOpen = ref<boolean>(false);

const onPointerOver = (e: Event, sprite: Sprite) => {
  console.log('onPointerOver', e.target);
  e.stopPropagation();
  sprite.removeEventListener('pointerover', (e) => onPointerOver(e, sprite));

  let scale = {x: sprite.scale.x, y: sprite.scale.y};
  let pos = {x: sprite.position.x, y: sprite.position.y};

  let tl = gsap.timeline({
    onComplete: () => {
      sprites.value.pop();
      console.log('onComplete Sprites :', sprites.value);
      sprite.removeFromParent();
      //sprite.destroy();
      if (sprites.value.length === 0) {
        isModalOpen.value = true;
        mainStore.isModalOpen = true;
      }
    }
  });
  tl.to(scale, {
    x: scale.x + 0.02,
    y: scale.y + 0.02,
    duration: 0.2,
    onUpdate: () => {
      sprite.scale.set(scale.x, scale.y);
    }
  });
  tl.to(pos, {
    x: pos.x,
    y: pos.y - 0.3,
    duration: 0.2,
    onUpdate: () => {
      sprite.position.set(pos.x, pos.y);
    }
  }, "<");
  tl.to(pos, {
    x: pos.x,
    y: pos.y + 10,
    onUpdate: () => {
      sprite.position.set(pos.x, pos.y);
    }
  });
  tl.to(sprite, {
    alpha: 0
  }, "<");
};

const next = () => {
  gameStore.currentSequence += 1;
  isModalOpen.value = false;
  mainStore.isModalOpen = false;
  TeamManagerInstance.nextSequence();
}

onMounted(() => {
  if (canvas.value) {
    let app = new Application({
      resolution: window.devicePixelRatio,
      width: width,
      height: height,
      autoStart: true,
      view: canvas.value,
      backgroundAlpha: 0,
    });

    //teamData.value = gameStore.data.gameSequences[gameStore.currentSequence].teams[gameStore.teamId];
    let soilZone = new Polygon([
      80,
      175,
      90,
      145,
      135,
      130,
      155,
      155,
      180,
      350,
      160,
      350,
      115,
      270
    ]);
    let soilGraphic = new Graphics();
    soilGraphic.beginFill(0XFF0000, 0.5);
    soilGraphic.drawPolygon(soilZone.points);
    soilGraphic.endFill();
    app.stage.addChild(soilGraphic);

    for (let i = 0; i < 30; i++) {
      let src = `/src/assets/game-data/images/00102/soil-v2.png`
      let sprite = Sprite.from(src);

      app.stage.addChild(sprite);
      sprites.value.push(sprite);

      sprite.anchor.set(0.5);
      sprite.scale.set(0.2, 0.2);

      let x = 0;
      let y = 0;

      while (!soilZone.contains(x, y)) {
        x = Math.random() * width
        y = Math.random() * height
      }
      sprite.position.set(x, y);

      sprite.eventMode = 'dynamic';

      sprite.addEventListener('pointerover', (e) => onPointerOver(e, sprite));

    }
      console.log('Sprites', sprites.value.length)
  }
});
</script>

<template>
  <div
      class="relative bg-purple w-full h-full grid grid-cols-12 gap-4 px-8 justify-center items-center text-center gap-5">
    <div class="w-full aspect-square bg-white rounded-full col-span-6 col-start-4 absolute"/>
    <div class="relative aspect-[5/9] col-span-6 col-start-4">
      <img :src="`/src/assets/game-data/images/00102/cosmic.png`"
           class="w-full h-full object-contain"/>
      <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full border-4 border-pink"/>
    </div>
  </div>
  <ModalView v-if="isModalOpen">
    <RoundButton @click="next">
      Continuer
    </RoundButton>
  </ModalView>
</template>