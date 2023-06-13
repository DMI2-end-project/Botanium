<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {Application, Graphics, Polygon, Sprite} from "pixi.js";
import {gsap} from "gsap";

import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";

const mainStore = useMainStore();
const gameStore = useGameStore();

interface TeamData {
  instruction: string,
  answers: any,
  points: number[],
  congratulation: any
}

const teamData = ref<any>();

let canvas = ref<HTMLCanvasElement>();
let width = 200;
let height = 390;

const isModalOpen = ref<boolean>(false);

const emits = defineEmits(['validated', 'openModal']);

const onPointerOver = (e: Event, app: Application, sprite: Sprite) => {
  e.stopPropagation();
  sprite.removeEventListener('pointerover', (e) => onPointerOver(e, app, sprite));

  let scale = {x: sprite.scale.x, y: sprite.scale.y};
  let pos = {x: sprite.position.x, y: sprite.position.y};

  let tl = gsap.timeline({
    onComplete: () => {
      sprite.removeFromParent();
      //sprite.destroy();
      if (app.stage.children.length === 0) {
        isModalOpen.value = true;
        mainStore.isModalOpen = true;
        //gameStore.currentSequence += 1;
        //TeamManagerInstance.nextSequence();
        emits('openModal');

        //console.log('complete & empty', gameStore.currentSequence, gameStore.data.gameSequences.length)
        //emits("validated");
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

    if (gameStore.teamId !== undefined) {
      teamData.value = gameStore.data.gameSequences[gameStore.currentSequence].teams[gameStore.teamId];

      let soilZone = new Polygon(teamData.value.points);
      /*
      let soilGraphic = new Graphics();
      soilGraphic.beginFill(0XFF0000, 0.5);
      soilGraphic.drawPolygon(soilZone.points);
      soilGraphic.endFill();
      app.stage.addChild(soilGraphic);
       */

      for (let i = 0; i < 30; i++) {
        let src = `/game/images/${mainStore.getFullGameId}/${teamData.value.sprite}`
        let sprite = Sprite.from(src);

        app.stage.addChild(sprite);

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

        sprite.addEventListener('pointerover', (e) => onPointerOver(e, app, sprite));
      }
    }
  }
});
</script>

<template>
  <div class="relative w-full h-full grid grid-cols-12 gap-4 px-8 justify-center items-center text-center gap-5">
    <div class="col-span-4 col-start-5 w-full mx-auto aspect-square bg-white rounded-full absolute"/>
    <div class="col-span-3 col-start-5 h-full flex justify-center items-center">
      <div class="h-full mx-auto flex justify-center items-center">
        <div class="relative aspect-[5/9] h-full">
          <img v-if="teamData" alt=""
               :src="`/game/images/${mainStore.getFullGameId}/${teamData.background}`"
               class="w-full h-full object-contain"/>
          <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full"/>
        </div>
      </div>
    </div>
  </div>
</template>
