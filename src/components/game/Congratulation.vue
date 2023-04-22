<script setup lang="ts">
import {useGameStore} from "../../stores/gameStore";
import Trophy from "../../assets/svg/ico-trophy.svg";

const gameStore = useGameStore();
</script>

<template>
  <div class="relative flex flex-col items-center text-beige text-center">
    <div class="absolute -translate-y-1/2 aspect-square w-36 text-beige bg-secondary rounded-full font-bold p-3">
      <span
          class="block w-full h-full flex justify-center items-center rounded-full border border-beige bg-secondary p-2">
        <Trophy class="w-14 aspect-square"/>
      </span>
    </div>
    <div class="bg-green rounded-md flex flex-col gap-4 items-center py-24 px-28">
      <h1>Incroyable !</h1>
      <p>{{ gameStore.data.congratulation }}</p>
    </div>
  </div>
</template>
