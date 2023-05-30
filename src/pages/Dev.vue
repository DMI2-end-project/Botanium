<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {GAME_STEP} from "../common/Constants";
import * as PIXI from 'pixi.js';

import gameData from "../assets/game-data/game-data-v2.json";

const mainStore = useMainStore();
const gameStore = useGameStore();
gameStore.data = gameData["00102"];
gameStore.teamId = 0;
gameStore.currentStep = GAME_STEP.WAIT;
</script>

<template>
  <div class="w-full h-full bg-green-medium grid grid-cols-12 gap-4 px-8 text-center gap-5">
    <div class="col-span-3 aspect-[3/5] flex justify-center items-center border border-dashed border-beige rounded-md p-7">
      <div class="w-full h-full aspect-[5/9] bg-beige rounded-md">
        <img src="/src/assets/game-data/images/00102/amphine.png" class="object-contain object-center"/>
      </div>
    </div>
    <div class="col-span-9 flex gap-9 rounded-md px-10 pt-9 pb-14 bg-beige-medium">
      <div class="w-full flex flex-col gap-6">
        <div class="w-full h-full aspect-[5-9] bg-white rounded-md">
        </div>
        <h3 class="bg-green text-beige rounded-md">
          Carotène
        </h3>
      </div>
      <div class="w-full flex flex-col gap-6">
        <div class="w-full h-full aspect-[5-9] bg-white rounded-md">

        </div>
        <h3 class="bg-green text-beige rounded-md">
          Carotène
        </h3>
      </div>
      <div class="w-full flex flex-col gap-6">
        <div class="w-full h-full aspect-[5-9] bg-white rounded-md">

        </div>
        <h3 class="bg-green text-beige rounded-md">
          Carotène
        </h3>
      </div>
    </div>
  </div>
</template>
