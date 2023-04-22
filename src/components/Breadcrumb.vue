<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";

// TODO : Deisgn
// TODO : Functionnal

const mainStore = useMainStore();
const gameStore = useGameStore();
let totalGames = 4;
</script>

<template>
  <div class="relative w-full flex items-center justify-between my-4">
    <div class="absolute w-full border-t-8 border-dotted border-secondary"/>
    <div v-for="(game, i) in totalGames" class="relative aspect-square w-16 rounded-full font-bold p-1"
         :class="i + 1 < mainStore.gameId ? 'bg-beige text-secondary' : 'bg-secondary text-beige'">
      <span class="block w-full h-full flex justify-center items-center rounded-full border"
            :class="i + 1 < mainStore.gameId ? 'bg-beige border-secondary' : 'bg-secondary border-beige'">
      {{ i + 1 }}
      </span>
    </div>
  </div>
</template>
