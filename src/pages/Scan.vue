<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
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

const openModal = (info: any) => {
  scanComponent.value.isScanning.value = false;
  exp.value = info;
  mainStore.isModalOpen = true;
  isModalOpen.value = true;
}

const launchScan = () => {
  console.log('launchScan', scanComponent.value)
  scan.value = true;
  scanComponent.value.isScanning = true;
}

const scanAgain = (scanAgain: boolean) => {
  scan.value = scanAgain;
  mainStore.isModalOpen = false;
  isModalOpen.value = false;
  launchScan();
}

// TODO : Add illustrations
// TODO : Correspondance fr / en
// TODO : Ajouter dans le flux
</script>

<template>
  <Introduction v-if="!scan" @scan="launchScan"/>
  <Scan v-show="scan" ref="scanComponent" @scanned="openModal"/>
  <ModalView v-if="isModalOpen" :close="false">
    <h1>Bravo !</h1>
    <p>Vous avez scanné le badge {{ exp }}</p>
    <p>Voulez vous scanner un autre badge ?</p>
    <div class="flex justify-center items-center gap-6">
      <RoundButton :color="COLOR.YELLOW" @click="()=>scanAgain(true)">
        <Camera/>
      </RoundButton>
      <RoundButton :color="COLOR.RED" @click="()=>scanAgain(false)">
        <Cross/>
      </RoundButton>
    </div>
  </ModalView>
</template>
