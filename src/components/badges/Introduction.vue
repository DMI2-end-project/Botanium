<script setup lang="ts">
import {defineEmits} from "vue";
import {useRouter} from "vue-router";
import {useMainStore} from "../../stores/mainStore";
import {useChapterStore} from "../../stores/chapterStore";
import {COLOR, ROLE} from "../../common/Constants";

import RoundButton from "../common/RoundButton.vue";

import Arrow from "../../assets/svg/ico-arrow.svg?component";
import Camera from "../../assets/svg/ico-photo.svg?component";

const emits = defineEmits(['scan']);


const router = useRouter();
const mainStore = useMainStore();
const chapterStore = useChapterStore();
</script>
<template>
  <div class="flex-1 w-full h-full grid grid-cols-12 gap-16 text-center pt-16 z-10">
    <div class="col-span-8 col-start-3 grid grid-cols-8 gap-11 heading-3 bg-beige rounded-lg pb-11 pt-20 mt-auto">
      <p class="col-span-6 col-start-2">
        Rassemblez tous les badges utilisés cette semaine et scannez les pour débloquer les connaissances nécessaires
        pour aider Capucine dans son aventure !
      </p>
      <div class="col-span-8 flex flex-col gap-3 justify-center items-center text-blue px-10">
        <p>Badges scannées {{ chapterStore.tasksScanned }} / {{ chapterStore.nbrTasks }}</p>
        <div class="w-full rounded-full bg-green h-7 p-1.5">
          <span class="block w-full h-full bg-blue rounded-full origin-left transition-transform"
                :style="{transform: 'scaleX('+ (chapterStore.tasksScanned) / (chapterStore.nbrTasks) +')'}"/>
        </div>
      </div>
    </div>
    <div class="col-span-12 flex gap-2 mx-auto">
      <RoundButton :color="COLOR.YELLOW" @click="() =>emits('scan')">
        <Camera/>
      </RoundButton>
      <RoundButton v-if="mainStore.role === ROLE.TEACHER" :color="COLOR.PURPLE"
                   @click="router.push(`/chapitre/${mainStore.getChapterId}`)">
        <Arrow class="rotate-180"/>
      </RoundButton>
    </div>
  </div>
</template>
