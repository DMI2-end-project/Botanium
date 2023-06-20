<script setup lang="ts">
import {onBeforeMount, Ref, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {Record} from "pocketbase";
import {useMainStore} from "../stores/mainStore";
import {useChapterStore} from "../stores/chapterStore";
import {useGameStore} from "../stores/gameStore";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {COLOR, SIZE} from "../common/Constants";
import {leading} from "../common/Lib";
import RoundButton from "../components/common/RoundButton.vue";
import CardChapter from "../components/chapter/CardChapter.vue";

import chaptersData from "../assets/chapters-data/chapters-data.json";

import Autumn from "../assets/svg/ico-autumn.svg";
import Winter from "../assets/svg/ico-winter.svg";
import Spring from "../assets/svg/ico-spring.svg";
import Summer from "../assets/svg/ico-summer.svg";

const router = useRouter();

const mainStore = useMainStore();
const chapterStore = useChapterStore();
const gameStore = useGameStore();

const seasons = ref<string[]>([]);

let chapters: Ref<Record[]> = ref([]);
let filteredChapters: Ref<Record[]> = ref([]);

onBeforeMount(async () => {
  if (mainStore.roomId) {
    chapters.value = await DatabaseManagerInstance.fetchChapters(mainStore.roomId);
    filteredChapters.value = chapters.value;
  }

  mainStore.$subscribe(async (mutation, state) => {
    // @ts-ignore
    if (mutation.events.key === "roomId" && state.roomId) {
      chapters.value = await DatabaseManagerInstance.fetchChapters(state.roomId);
      filteredChapters.value = chapters.value;
    }
  })
});

watch(seasons, (newSeason, _) => {
  if (newSeason.length === 0) {
    filteredChapters.value = chapters.value;
  } else {
    filteredChapters.value = chapters.value.filter(c => newSeason.includes(c.season));
  }
  /*
  if (newSeason) {
    filteredChapters.value = chapters.value.filter(c => c.season === newSeason);
  } else {
    filteredChapters.value = chapters.value;
  }
   */
}, {deep: true});

const setSeasons = (season: string) => {
  let found = seasons.value.findIndex(s => s === season);
  if (found !== -1) {
    seasons.value.splice(found, 1);
  } else {
    seasons.value.push(season);
  }
}

const goTo = async (e: Event, c: number, id: string) => {
  GameMasterManagerInstance.launchChapter(c, id);
}
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12 px-8">
    <div class="flex justify-between items-center">
      <div></div>
      <div class="bg-beige rounded-full font-bold text-center leading-none px-10 py-6">
        <h3>Chapitres et thématiques :</h3>
        <p>Gérez les prochaines thématiques que vous souhaitez voir en classe</p>
      </div>
      <div></div>
    </div>
    <div class="bg-beige/50 rounded-lg w-full h-full grid grid-cols-12 items-center gap-4 px-5 py-8">
      <p class="col-span-12 lg:col-span-6 font-hand-written text-lg leading-tight lg:leading-none">
        Capucine au monde des minuscules
      </p>
      <div
          class="col-span-12 lg:col-span-6 bg-beige rounded-lg flex flex-col sm:flex-row sm:items-center justify-around gap-4 font-bold p-4">
        <div class="cursor-pointer flex items-center gap-2" @click="()=>setSeasons('autumn')"
             :class="seasons.includes('autumn') ? 'text-yellow' : 'text-green'">
          <RoundButton :key="seasons.length" :size="SIZE.XS"
                       :color="seasons.includes('autumn') ? COLOR.YELLOW : COLOR.GREEN">
            <Autumn/>
          </RoundButton>
          Automne
        </div>
        <div class="cursor-pointer flex items-center gap-2" @click="()=>setSeasons('winter')"
             :class="seasons.includes('winter') ? 'text-yellow':'text-green'">
          <RoundButton :key="seasons.length" :size="SIZE.XS"
                       :color="seasons.includes('winter') ? COLOR.YELLOW : COLOR.GREEN">
            <Winter/>
          </RoundButton>
          Hiver
        </div>
        <div class="cursor-pointer flex items-center gap-2" @click="()=>setSeasons('spring')"
             :class="seasons.includes('spring') ? 'text-yellow':'text-green'">
          <RoundButton :key="seasons.length" :size="SIZE.XS"
                       :color="seasons.includes('spring') ? COLOR.YELLOW : COLOR.GREEN">
            <Spring/>
          </RoundButton>
          Printemps
        </div>
        <div class="cursor-pointer flex items-center gap-2" @click="()=>setSeasons('summer')"
             :class="seasons.includes('summer') ? 'text-yellow':'text-green'">
          <RoundButton :key="seasons.length" :size="SIZE.XS"
                       :color="seasons.includes('summer') ? COLOR.YELLOW : COLOR.GREEN">
            <Summer/>
          </RoundButton>
          Ete
        </div>
      </div>
      <CardChapter v-for="c in filteredChapters" @click="(e) => goTo(e, c.number, c.id)"
                   :index="c.number" :card-state="c.status" :item="chaptersData[leading(c.number, 3)]"
                   class="cursor-pointer col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 h-full inline-block bg-beige rounded-md p-2"/>
    </div>
  </div>
</template>
