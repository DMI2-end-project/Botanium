<script setup lang="ts">
import {computed, onBeforeMount, Ref, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {Record} from "pocketbase";
import {useMainStore} from "../stores/mainStore";
import {useChapterStore} from "../stores/chapterStore";
import {useGameStore} from "../stores/gameStore";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {COLOR, SIZE} from "../common/Constants";
import {leading} from "../common/Lib";
import ChapterModalView from "../components/chapter/ChapterModalView.vue";
import RoundButton from "../components/common/RoundButton.vue";
import CardChapter from "../components/chapter/CardChapter.vue";

import chaptersData from "../assets/json/chapters-data.json";

import Filter from "../assets/svg/ico-filter.svg?component";
import Autumn from "../assets/svg/ico-autumn.svg?component";
import Winter from "../assets/svg/ico-winter.svg?component";
import Spring from "../assets/svg/ico-spring.svg?component";
import Summer from "../assets/svg/ico-summer.svg?component";
import {ChapterData} from "../common/Interfaces";
import DefaultLayout from "../layouts/DefaultLayout.vue";

const router = useRouter();

const mainStore = useMainStore();
const chapterStore = useChapterStore();
const gameStore = useGameStore();

const seasons = ref<string[]>([]);
const chapter = ref<any>();

let chapters: Ref<Record[]> = ref([]);
let filteredChapters: Ref<Record[]> = ref([]);

const isModalOpen = ref<boolean>(false);

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

const closeModal = () => {
  isModalOpen.value = false;
  mainStore.isModalOpen = false;
}

const setChapter = (c: any) => {
  chapter.value = c;
  isModalOpen.value = true;
  mainStore.isModalOpen = true;
}

const data: ChapterData = chaptersData;

const getChapterData = (c: any) => {
  if (c) {
    return data[leading(c.number, 3)];
  }
}

</script>

<template>
  <div class="w-full h-full flex flex-col gap-12 px-8 pb-10 lg:pb-16 pt-4 lg:pt-6">
    <div class="flex justify-between items-center">
      <div></div>
      <div class="bg-beige rounded-full font-bold text-center leading-none px-10 py-6">
        <h3>Chapitres et thématiques :</h3>
        <p>Gérez les prochaines thématiques que vous souhaitez voir en classe</p>
      </div>
      <div></div>
    </div>
    <div class="bg-beige/50 rounded-lg w-full h-full flex flex-col gap-10 px-5 py-8">
      <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <p class="col-span-12 lg:col-span-6 font-hand-written text-lg leading-tight lg:leading-none">
          Capucine au monde des minuscules
        </p>
        <div
            class="col-span-12 lg:col-span-6 bg-beige rounded-lg flex flex-wrap items-center gap-6 font-bold py-4 px-6">
          <Filter class="text-beige-medium w-5"/>
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
      </div>
      <div class="grid grid-cols-12 items-center gap-4">
        <CardChapter v-for="c in filteredChapters" @click="() => setChapter(c)"
                     :index="c.number" :card-state="c.status" :item="getChapterData(c)"
                     class="cursor-pointer col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 h-full inline-block bg-beige rounded-md p-2"/>
      </div>
    </div>
  </div>
  <ChapterModalView v-if="mainStore.isModalOpen && isModalOpen" :chapter="chapter" :data="getChapterData(chapter)"
                    :close="closeModal"/>
</template>
