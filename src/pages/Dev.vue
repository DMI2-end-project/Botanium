<script setup lang="ts">
import {onMounted, ref} from "vue";
import {gsap} from "gsap";
import {Draggable} from "gsap/Draggable";
import {Flip} from "gsap/Flip";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {GAME_STEP} from "../common/Constants";

gsap.registerPlugin(Draggable, Flip);

import gameData from "../assets/game-data/game-data-v2.json";

const mainStore = useMainStore();
const gameStore = useGameStore();
gameStore.data = gameData["00102"];
gameStore.teamId = 0;
gameStore.currentStep = GAME_STEP.WAIT;

const draggable = ref<HTMLDivElement>();

onMounted(() => {
  const droppables = document.querySelectorAll('.droppable');
  const container = document.querySelector('#container');

  if (draggable.value) {
    Draggable.create(draggable.value, {
      type: "x,y",
      edgeResistance: 0.65,
      inertia: true,
      onDrag: function (e) {
        droppables.forEach(droppable => {
          if (this.hitTest(droppable, "50%")) {
            droppable.classList.add('bg-green-light');
          } else {
            droppable.classList.remove('bg-green-light');
          }
        })
      },
      onDragEnd: function (e) {
        let miss = true;
        droppables.forEach(droppable => {
          if (this.hitTest(droppable, "50%")) {
            console.log('droppable', droppable)
            miss = false;
            if (draggable.value) {
              Flip.fit(draggable.value, droppable);
            }
          }
        });

        if (miss) {
          console.log('missed !!!', container)
          if (draggable.value && container) {
            Flip.fit(draggable.value, container);
          }
        }
      }
    });
  }
})


</script>

<template>
  <div
       class="w-full h-full flex-1 flex items-center bg-green-medium grid grid-cols-12 gap-4 px-8 text-center gap-5">
    <div
        class="col-span-3 aspect-[3/5] flex justify-center items-center border border-dashed border-beige rounded-md p-7">
      <div id="container" class="relative w-full h-full aspect-[5/9]">
        <div ref="draggable" class="w-full h-full bg-beige rounded-md">
          <img src="/src/assets/game-data/images/00102/amfine.png"
               class="object-contain object-center"/>
        </div>
      </div>
    </div>
    <div class="col-span-9 flex gap-9 rounded-md px-10 pt-9 pb-14 bg-beige-medium">
      <div class="w-full flex flex-col justify-center items-center gap-6">
        <div class="droppable w-full aspect-[5/9] bg-beige rounded-md">
        </div>
        <h3 class="w-full bg-green text-beige rounded-md">
          Carotène
        </h3>
      </div>

      <div class="w-full flex flex-col justify-center items-center gap-6">
        <div class="droppable w-full aspect-[5/9] bg-beige rounded-md">
        </div>
        <h3 class="w-full bg-green text-beige rounded-md">
          Carotène
        </h3>
      </div>
      <div class="w-full flex flex-col justify-center items-center gap-6">
        <div class="droppable w-full aspect-[5/9] bg-beige rounded-md">
        </div>
        <h3 class="w-full bg-green text-beige rounded-md">
          Carotène
        </h3>
      </div>
    </div>
  </div>
</template>
