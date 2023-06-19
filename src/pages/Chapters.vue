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

const season = ref<string>();

let chapters: Ref<Record[]> = ref([]);

// TODO : Filter

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
  GameMasterManagerInstance.launchChapter(c + 1, id);
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
        <div :key="season" class="cursor-pointer flex items-center gap-2" @click="season = 'autumn'"
             :class="season === 'autumn' ? 'text-yellow':'text-green'">
          <RoundButton :size="SIZE.XS" :color="season === 'autumn' ? COLOR.YELLOW : COLOR.GREEN">
            <Autumn/>
          </RoundButton>
          Automne
        </div>
        <div :key="season" class="cursor-pointer flex items-center gap-2" @click="season = 'winter'"
             :class="season === 'winter' ? 'text-yellow':'text-green'">
          <RoundButton :size="SIZE.XS" :color="season === 'winter' ? COLOR.YELLOW : COLOR.GREEN">
            <Winter/>
          </RoundButton>
          Hiver
        </div>
        <div :key="season" class="cursor-pointer flex items-center gap-2" @click="season = 'spring'"
             :class="season === 'spring' ? 'text-yellow':'text-green'">
          <RoundButton :size="SIZE.XS" :color="season === 'spring' ? COLOR.YELLOW : COLOR.GREEN">
            <Spring/>
          </RoundButton>
          Printemps
        </div>
        <div :key="season" class="cursor-pointer flex items-center gap-2" @click="season = 'summer'"
             :class="season === 'summer' ? 'text-yellow':'text-green'">
          <RoundButton :size="SIZE.XS" :color="season === 'summer' ? COLOR.YELLOW : COLOR.GREEN">
            <Summer/>
          </RoundButton>
          Ete
        </div>
      </div>
      <CardChapter v-for="(c,i) in chapters" @click="(e) => goTo(e, i, c.id)"
                   :index="i+1" :card-state="c.status" :item="chaptersData[leading(i+1, 3)]"
                   class="cursor-pointer col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 h-full inline-block bg-beige rounded-md p-2"/>
    </div>
  </div>
</template>
