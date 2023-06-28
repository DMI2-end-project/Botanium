<script lang="ts" setup>
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import CardGame from "../components/game/CardGame.vue";
import CardSlot from "../components/game/CardSlot.vue";

const mainStore = useMainStore();
const gameStore = useGameStore();

const answerState = 'selected';
const cardState = 'show';
</script>

<template>
  <div class="grid grid-cols-12 gap-10 w-full h-full bg-purple">
    <div class="col-start-4 col-span-3 w-full h-full my-auto">
      <div class="flex h-full">
        <CardGame mode="vertical" :answer-state="answerState" :card-state="cardState" class="aspect-[5/9]">
          <template v-slot:recto>
            Coucou
          </template>
        </CardGame>
      </div>

    </div>
    <div class="col-span-3 w-full h-full">
      <CardSlot :answer-state="answerState" outline class="aspect-[5/9]">
        <div class="w-full h-full flex flex-col items-center justify-center text-center">
          Coucou
        </div>
      </CardSlot>
    </div>
  </div>
</template>