<script setup lang="ts">
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";

// TODO : Deisgn
// TODO : Functionnal

const mainStore = useMainStore();
const gameStore = useGameStore();
let totalGames = 4;
</script>

<template>
  <div class="relative w-full flex items-center justify-around my-4">
    <div class="absolute w-full border-t-4 border-dotted"/>
    <div v-for="(game, i) in totalGames" class="relative bg-white rounded-full p-2 {{i + 1 < mainStore.gameId ? 'bg-black' : 'bg-white shadow-inner shadow-black'}}"/>
  </div>
</template>
