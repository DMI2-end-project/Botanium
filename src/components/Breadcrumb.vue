<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {GAME_STEP} from "../common/Constants";

import Check from "../assets/svg/ico-check.svg?component";

import ZERO from "../assets/svg/numbers/0.svg?component";
import ONE from "../assets/svg/numbers/1.svg?component";
import TWO from "../assets/svg/numbers/2.svg?component";
import THREE from "../assets/svg/numbers/3.svg?component";
import FOUR from "../assets/svg/numbers/4.svg?component";
import FIVE from "../assets/svg/numbers/5.svg?component";
import SIX from "../assets/svg/numbers/6.svg?component";
import SEVEN from "../assets/svg/numbers/7.svg?component";
import EIGHT from "../assets/svg/numbers/8.svg?component";
import NINE from "../assets/svg/numbers/9.svg?component";
import {onBeforeMount} from "vue";

const mainStore = useMainStore();
const gameStore = useGameStore();
let totalGames = 4;

/*
TODO : Pop animation of check,
TODO : onMounted animate scaleX of the line
 */

const getNumberComponent = (number: number) => {
  // TODO : to improve for numbers > 9
  switch (number) {
    case 1:
      return ONE;
      break;
    case 2:
      return TWO;
      break;
    case 3:
      return THREE;
      break;
    case 4:
      return FOUR;
      break;
  }
}

onBeforeMount(() => {
  if (gameStore.data) {
    switch (gameStore.data.colorBreadcrumb) {
      case 'yellow':
        break;
      case 'green':
        break;
    }
  }
})
</script>

<template>
  <div class="grid grid-cols-12">
    <div class="col-start-2 col-span-10 relative w-full flex items-center justify-between">

      <div class="absolute flex w-full mx-auto bg-repeat-x	bg-contain h-2 overflow-hidden"
           :class="gameStore.data?.colorBreadcrumb === 'yellow' ? 'bg-dotted-yellow' : 'bg-dotted-green'">
        <div class=" w-full h-full origin-left transition-transform"
             :class="gameStore.data?.colorBreadcrumb === 'yellow' ? 'bg-yellow' : 'bg-green'"
             :style="{transform: 'scaleX('+ ((mainStore.gameId ? mainStore.gameId : 1) - 1) / ((totalGames ? totalGames : 1) - 1) +')'}"/>
      </div>
      <!-- border-t-8 border-dotted border-secondary -->
      <div v-for="(_, i) in totalGames"
           class="relative flex justify-center items-center aspect-square w-14 rounded-full font-bold p-4"
           :class="i + 1 <= mainStore.gameId ? 'bg-beige text-secondary' : gameStore.data?.colorBreadcrumb === 'yellow' ? 'bg-yellow text-beige' : 'bg-green text-beige'">
        <component class="w-full" :is="getNumberComponent(i + 1)"/>
        <div
            class="absolute top-0 right-0 -translate-y-1/5 translate-x-1/4 aspect-square w-6 rounded-full shadow-md p-1.5"
            :class="(i + 1 < mainStore.gameId) || (i + 1 === mainStore.gameId && gameStore.currentStep === GAME_STEP.CONGRATS) ? '':'hidden', gameStore.data?.colorBreadcrumb === 'yellow' ? 'bg-yellow' : 'bg-green'">
          <Check class="text-white w-full aspect-square"/>
        </div>
      </div>
    </div>
  </div>
</template>
