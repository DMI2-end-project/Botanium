<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";

// TODO : Design
// TODO : Functionnal

const mainStore = useMainStore();
const gameStore = useGameStore();
let totalGames = 4;

</script>

<template>
  <div class="relative w-full flex items-center justify-between my-4">
    <div class="absolute w-full border-t-8 border-dotted border-secondary"/>
    <div v-for="(_, i) in totalGames"
         class="relative flex justify-center items-center aspect-square w-14 rounded-full font-bold p-1"
         :class="i + 1 < mainStore.gameId ? 'bg-beige text-secondary' : 'bg-secondary text-beige'">
      {{ i + 1 }}
    </div>
  </div>
</template>
