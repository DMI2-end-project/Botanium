<script setup lang="ts">
import {ref} from "vue";
import {useMainStore} from "../../stores/mainStore";
import {COLOR, SIZE} from "../../common/Constants";
import {leading} from "../../common/Lib";
import {GameMasterManagerInstance} from "../../common/GameMasterManager";
import RoundButton from "../../components/common/RoundButton.vue";

import Cross from "../../assets/svg/ico-cross.svg?component";
import Play from "../../assets/svg/ico-play.svg?component";

const mainStore = useMainStore();
const props = defineProps(['chapter', 'data', 'close']);

const container = ref<HTMLDivElement>();

const goTo = async () => {
  props.close()
  GameMasterManagerInstance.launchChapter(props.chapter.number, props.chapter.id);
}

const getImage = () => {
  let chapterNumber = "001";
  if (props.chapter && props.chapter.number) {
    chapterNumber = leading(props.chapter.number, 3);
  }

  return `/chapter/${chapterNumber}/preview-chapter-${chapterNumber}.png`;
}

</script>

<template>
  <Teleport to="#modal">
    <div class="fixed top-0 left-0 w-screen h-screen bg-green bg-opacity-80 flex justify-center items-center z-50">
      <div class="container bg-beige rounded-lg flex flex-col gap-10 font-semibold pt-3 p-5">
        <div class="flex justify-between items-center gap-8">

          <div class="flex-1 bg-green-medium/70 rounded-lg flex justify-between items-center px-6 py-2 mb-auto">
            <div class="flex items-center divide-x divide-beige">
              <div class="flex flex-col pr-10">
                <span class="font-semibold text-xs">Thématique</span>
                <p class="text-beige leading-tight">{{ props.data.thematic }}</p>
              </div>
              <div class="flex flex-col px-10">
                <span class="font-semibold text-xs">Chapitre</span>
                <p class="text-beige leading-tight">{{ props.data.title }}</p>
              </div>
            </div>

            <p class="ml-auto justify-self-end">{{ props.data.number }}</p>
          </div>
          <RoundButton :color="COLOR.RED" :size="SIZE.XS" @click="props.close">
            <Cross/>
          </RoundButton>
        </div>

        <div class="flex flex-col sm:flex-row gap-8">
          <div class="w-full sm:w-2/5 shrink-0">
            <div
                class="bg-green-medium aspect-square w-full flex flex-col justify-end rounded-lg overflow-hidden shadow-md">
              <img class="w-full flex-1 rounded-lg object-center object-cover"
                   :src="getImage()"/>
              <button
                  class="hover:border-transparent cursor-pointer relative bg-green-medium text-beige flex items-center gap-5 p-5"
                  @click="goTo">
                <RoundButton :color="COLOR.YELLOW" :size="SIZE.XS">
                  <Play/>
                </RoundButton>
                <span>Commencer la séance</span>
              </button>
            </div>
          </div>
          <div class="flex flex-col divide-y divide-beige-dark">
            <div class="flex flex-col gap-5 pb-8">
              <h3 class="text-green-medium">Résumé</h3>
              <p class="p2 leading-tight">{{ props.data.summary }}</p>
              <div class="flex gap-4">
                <button class="font-bold bg-green">Lire l'histoire</button>
                <button class="font-bold bg-green">Déroulé de l'histoire interactive</button>
              </div>
            </div>
            <div class="flex flex-col gap-5 pt-8">
              <p class="p1 text-green-medium">Connaissances abordées</p>
              <p class="p2 leading-tight">{{ props.data.knowledge }}</p>
              <button class="font-bold bg-green mr-auto">Fiche connaissance complète</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>