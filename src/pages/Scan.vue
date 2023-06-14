<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {useChapterStore} from "../stores/chapterStore";
import Introduction from "../components/badges/Introduction.vue";
import Scan from "../components/badges/Scan.vue";
import ModalView from "../components/common/ModalView.vue";
import RoundButton from "../components/common/RoundButton.vue";
import {COLOR} from "../common/Constants";

import Camera from "../assets/svg/ico-photo.svg?component";
import Cross from "../assets/svg/ico-cross.svg?component";

const router = useRouter();
const mainStore = useMainStore();
const chapterStore = useChapterStore();

const scanComponent = ref();
const scan = ref<boolean>(false);
const isModalOpen = ref<boolean>(false);
const exp = ref<string>('');

onMounted(() => {
  console.log('ref', scanComponent);
});

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
  console.log('launchScan', scanComponent);
  mainStore.isModalOpen = false;
  isModalOpen.value = false;
  scanComponent.value.start();
}

// TODO : Add illustrations
// TODO : Correspondance fr / en
// TODO : Ajouter dans le flux
</script>

<template>
  <Introduction v-if="!scan" @scan="scan = true"/>
  <Scan v-if="scan" ref="scanComponent" @ready="launchScan"  @scanned="openModal"/>
  <ModalView v-if="isModalOpen" :close="false">
    <h1>Bravo !</h1>
    <p>La mission {{ exp }} a été validé !!</p>
    <p>Voulez vous scanner un autre badge ?</p>
    <div class="flex justify-center items-center gap-6">
      <RoundButton :color="COLOR.YELLOW" @click="launchScan">
        <Camera/>
      </RoundButton>
      <RoundButton :color="COLOR.RED" @click="router.push(`/chapitre/${mainStore.getGameId}`)">
        <Cross/>
      </RoundButton>
    </div>
  </ModalView>
</template>
