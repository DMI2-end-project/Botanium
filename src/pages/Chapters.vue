<script setup lang="ts">
import {useRouter} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {leading} from "../common/Lib";
import gameData from "../assets/game-data/game-data-v2.json";
import Card from "../components/Card.vue";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {Record} from "pocketbase";
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import type {Ref} from 'vue';


const mainStore = useMainStore();
const gameStore = useGameStore();
const router = useRouter();
let chapters: Ref<Record[]> = ref([]);

// TODO : create Interface

onBeforeMount(async () => {
  if (mainStore.roomId) {
    chapters.value = await DatabaseManagerInstance.fetchChapters(mainStore.roomId);
  }
  mainStore.$subscribe(async (mutation, state) => {
    // @ts-ignore
    if (mutation.events.key === "roomId" && state.roomId) {
      chapters.value = await DatabaseManagerInstance.fetchChapters(state.roomId);
    }
  })
});

const goTo = async (e: Event, c: number, id: string) => {
  GameMasterManagerInstance.launchChapter(c + 1, id)
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
      <div @click="(e) => goTo(e, i, c.id)" v-for="(c,i) in chapters"
           class="col-span-3 inline-block bg-beige rounded-md p-2">
        Chapitre {{ i + 1 }}
        {{ c.status }}
      </div>
    </div>
  </div>
</template>
