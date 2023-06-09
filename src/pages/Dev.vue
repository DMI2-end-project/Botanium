<script lang="ts" setup>
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import CardGame from "../components/game/CardGame.vue";

const mainStore = useMainStore();
const gameStore = useGameStore();

</script>

<template>
  <div class="flex w-full h-full">
    <div class="w-full h-full border-4 border-blue">
      <div class="flex h-full">
        <CardGame mode="vertical" answer-state="none" card-state="show" class="aspect-[5/9]">
          <template v-slot:recto>
            Coucou
          </template>
        </CardGame>
      </div>

    </div>
    <div class="w-full h-full border-4 border-red">

    </div>
  </div>
</template>