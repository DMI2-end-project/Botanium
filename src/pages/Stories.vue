<script setup lang="ts">
import {useRouter} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {leading} from "../common/Lib";
import gameData from "../assets/game-data/game-data-v2.json";
import Card from "../components/Card.vue";

const mainStore = useMainStore();
const gameStore = useGameStore();
const router = useRouter();
let chapters = 2;

const goTo = async (e: Event, c: number) => {
  gameStore.reset();
  let chapter = c + 1;
  mainStore.chapterId = chapter;
  gameStore.data = gameData;
  await router.push('/chapitre/' + leading(chapter, 3));
}
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <div class="text-center">
      <h1>Capucine au monde des minuscules</h1>
      <h2>Choisissez le chapitre du jour</h2>
    </div>
    <div class="grid grid-cols-12 gap-4">
      <!--Card v-for="(c,i) in chapters" :chapterId="i+1" class="col-span-3"/-->
      <div @click="(e) => goTo(e, i)" v-for="(c,i) in chapters"
           class="col-span-3 inline-block bg-beige rounded-md p-2">
        Chapitre {{ i + 1 }}
      </div>
    </div>
  </div>
</template>
