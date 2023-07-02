<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {useChapterStore} from "../stores/chapterStore";
import Introduction from "../components/badges/Introduction.vue";
import Scan from "../components/badges/Scan.vue";
import ModalView from "../components/common/ModalView.vue";
import RoundButton from "../components/common/RoundButton.vue";
import {COLOR} from "../common/Constants";

import Arrow from "../assets/svg/ico-arrow.svg?component";
import Camera from "../assets/svg/ico-photo.svg?component";
import Cross from "../assets/svg/ico-cross.svg?component";
import AnimatedFoliage from "../components/AnimatedFoliage.vue";

const router = useRouter();
const mainStore = useMainStore();
const chapterStore = useChapterStore();

const scanComponent = ref();
const scan = ref<boolean>(false);
const isModalOpen = ref<boolean>(false);
const exp = ref<string>('');

const openModal = (info: any) => {
  exp.value = info;
  mainStore.isModalOpen = true;
  isModalOpen.value = true;
}

const closeModal = () => {
  mainStore.isModalOpen = false;
  isModalOpen.value = false;
}

const launchScan = () => {
  mainStore.isModalOpen = false;
  isModalOpen.value = false;
  scanComponent.value.start();
}

// TODO : Add illustrations
// TODO : Correspondance fr / en
</script>

<template>
  <div class="fixed overflow-hidden top-0 left-0 right-0 bottom-0">
    <AnimatedFoliage :show="true" :class="scan ? 'z-50 overflow-hidden': '-z-10'"/>
  </div>
  <Introduction v-if="!scan" @scan="scan = true"/>
  <Scan v-if="scan" ref="scanComponent" @ready="launchScan" @scanned="openModal"/>
  <ModalView v-if="isModalOpen" :close="false">
    <h1>Bravo !</h1>
    <p>La mission <b>{{ exp }}</b> a été validé !!</p>
    <p v-if="!chapterStore.sheetUnlocked">Voulez vous scanner un autre badge ?</p>
    <p v-if="chapterStore.sheetUnlocked">Vous avez scanné tous les badges nécessaires ! La fiche est débloquée !</p>
    <div class="flex justify-center items-center gap-6">
      <RoundButton v-if="!chapterStore.sheetUnlocked" :color="COLOR.YELLOW" @click="launchScan">
        <Camera/>
      </RoundButton>
      <RoundButton v-if="!chapterStore.sheetUnlocked" :color="COLOR.RED"
                   @click="router.push(`/chapitre/${mainStore.getChapterId}`)">
        <Cross/>
      </RoundButton>
      <RoundButton v-if="chapterStore.sheetUnlocked" :color="COLOR.PINK"
                   @click="router.push(`/chapitre/${mainStore.getChapterId}`)">
        <Arrow class="rotate-180"/>
      </RoundButton>
    </div>
  </ModalView>
</template>
