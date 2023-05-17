<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import gameData from "../assets/game-data/game-data-v2.json";
import { GAME_STEP } from "../common/Constants";

const mainStore = useMainStore();
const gameStore = useGameStore();
gameStore.data = gameData["00101"];
gameStore.teamId = 0;
gameStore.currentStep = GAME_STEP.WAIT;

</script>

<template>
  <div class="w-full h-full bg-green-medium grid grid-cols-12 text-center gap-5">

  </div>
</template>
