<script setup lang="ts">
import { GameMasterManagerInstance } from "../../common/GameMasterManager"
import {useGameStore} from "../../stores/gameStore";
import {useMainStore} from "../../stores/mainStore";
import {COlOR, SIZE, ROLE} from "../../common/Constants";
import RoundButton from "../common/RoundButton.vue";
import RoundItemVue from "../common/RoundItem.vue";

import Trophy from "./../../assets/svg/ico-trophy.svg?component";
// TODO : Add ico-arrow.svg
//import Arrow from "../../assets/svg/ico-arrow.svg?component";

const mainStore = useMainStore();
const gameStore = useGameStore();


const text = () => {
  if (!gameStore.data?.gameSequences[gameStore.currentSequence].congratulation && gameStore.currentSequence + 1 < gameStore.data?.gameSequences.length) {
    gameStore.currentSequence += 1;
  }
  return gameStore.data?.gameSequences[gameStore.currentSequence].congratulation?.text
}

const next = async () => {
  GameMasterManagerInstance.backChapter()
}
</script>

<template>
  <div class="relative flex flex-col items-center text-beige text-center my-20">
    <RoundItemVue :size="SIZE.LG" :color="COlOR.YELLOW" class="absolute translate-y-1/2">
      <Trophy class="w-14 aspect-square"/>
    </RoundItemVue>
    <div class="w-full bg-green rounded-md flex flex-col gap-4 items-center py-24 px-28">
      <h1>Incroyable !</h1>
      <p>{{ text() }}</p>
    </div>
    <RoundButton v-if="mainStore.role === ROLE.TEACHER" @click="next" class="mt-8 text-lg font-bold">
      >
    </RoundButton>
  </div>
</template>
