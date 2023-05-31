<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import * as PIXI from "pixi.js";
import {gsap} from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";
import ModalView from "../../../common/ModalView.vue";
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import RoundButton from "../../../common/RoundButton.vue";

gsap.registerPlugin(PixiPlugin);

const props = defineProps(['data']);

const mainStore = useMainStore();
const gameStore = useGameStore();
console.log('data', props.data, gameStore.data);

let canvas = ref<HTMLCanvasElement | null>(null);
let width = 200;
let height = 390;

let teamData = ref<any>(null);

onMounted(() => {
  if (canvas.value) {
    let app = new PIXI.Application({
      resolution: window.devicePixelRatio,
      width: width,
      height: height,
      autoStart: true,
      view: canvas.value,
      backgroundAlpha: 0,
    });

    if (gameStore.teamId !== undefined) {
      teamData.value = gameStore.data.gameSequences[gameStore.currentSequence].teams[gameStore.teamId];
      console.log('teamData', teamData.value)
      let soilZone = new PIXI.Polygon(teamData.value.points);
      /*
      let soilGraphic = new PIXI.Graphics();
      soilGraphic.beginFill(0XFF0000, 0.5);
      soilGraphic.drawPolygon(soilZone.points);
      soilGraphic.endFill();
      app.stage.addChild(soilGraphic);
      */

      const sprites = ref<PIXI.Sprite[]>([]);
      for (let i = 0; i < 20; i++) {
        let src = `/src/assets/game-data/images/${mainStore.getFullGameId}/${teamData.value.answers.sprite}`
        let sprite = PIXI.Sprite.from(src);

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
        sprites.value.push(sprite);

        sprite.eventMode = 'dynamic';

        sprite.on('pointerover', (e) => {
          let scale = {x: sprite.scale.x, y: sprite.scale.y};
          let pos = {x: sprite.position.x, y: sprite.position.y};

          let tl = gsap.timeline({
            onComplete: () => {
              sprites.value.pop();
              sprite.removeFromParent();
              sprite.destroy();
              if (sprites.value.length === 0) {
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
          }, 0);
          tl.to(pos, {
            x: pos.x,
            y: pos.y + 10,
            onUpdate: () => {
              sprite.position.set(pos.x, pos.y);
            }
          });
        });
      }

    }
  }
});
</script>

<template>
  <div class="w-full h-full bg-green-medium grid grid-cols-12 gap-4 px-8 text-center gap-5">
    <div class="relative aspect-[5/9] col-span-4 col-start-5">
      <img v-if="teamData" :src="`/src/assets/game-data/images/${mainStore.getFullGameId}/${teamData.answers.background}`"
           class="w-full h-full object-contain"/>
      <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full border-4 border-pink"/>
    </div>
  </div>
  <ModalView>
    <RoundButton @click="() => { gameStore.currentSequence += 1 }">
      Continuer
    </RoundButton>
  </ModalView>
</template>