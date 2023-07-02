<template>
  <div class="relative bg-beige  flex flex-col items-center gap-8 rounded-lg p-8 pt-0">

    <div class="bg-beige rounded-full aspect-square flex items-center justify-center p-8 -mt-16 -mb-16">
      <p class="font-title font-bold text-2xl text-green-medium -mt-4">{{ teamsConnected.length }} /
        {{ gameStore.teams.length }}</p>
    </div>

    <h2 class="text-center font-title font-bold text-2xl text-green leading-none">Tablettes connectées</h2>

    <div class="flex flex-col items-center gap-3">
      <div v-for="team in gameStore.teams" :v-bind="team._socketId"
           :class="!statusNeeded ? 'bg-green-light text-green font-bold' : team.isConnected ? (microNeeded && !team.hasMicro ? 'bg-yellow' : 'bg-green-medium') : 'bg-red'"
           class="text-beige w-fit pl-4 pr-8 py-1 rounded-full flex items-center">
        <div v-if="microNeeded">
          <Loading v-if="team.hasMicro === null" class="loading-animation h-6 mr-4"/>
          <MicroOn v-else-if="team.hasMicro" class="h-6 mr-4"/>
          <MicroOff v-else-if="!team.hasMicro" class="h-6 mr-4"/>
        </div>
        <p class="pl-4">{{ team._name }}</p>
      </div>
    </div>

    <div v-if="statusNeeded" class="flex flex-wrap justify-center gap-x-6 gap-y-1">
      <div v-for="stat in status" :v-bind="stat.text" class="flex items-center">
        <span :class="stat.bgClass" class="aspect-square w-4 h-4 rounded-full mr-2"/>
        <p class="text-sm">{{ stat.text }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../../stores/gameStore";
import {useMainStore} from "../../../stores/mainStore";
import {COLOR, SIZE} from '../../../common/Constants';
import ModalView from "../../common/ModalView.vue";
import RoundButton from "../../common/RoundButton.vue";
import CircleButton from "../../common/CircleButton.vue";

import Wifi from "./../../../assets/svg/ico-wifi.svg?component";
import Cross from "./../../../assets/svg/ico-cross.svg?component";
import MicroOn from "./../../../assets/svg/ico-micro-on.svg?component";
import MicroOff from "./../../../assets/svg/ico-micro-off.svg?component";
import Loading from "./../../../assets/svg/ico-loading.svg?component";

export default defineComponent({
  name: 'InstructionComponent',
  components: {Wifi, ModalView, RoundButton, CircleButton, Cross, MicroOn, MicroOff, Loading},
  props: {
    statusNeeded: Boolean,
  },
  data() {
    return {
      gameStore: useGameStore(),
      mainStore: useMainStore(),
      isModalOpen: false,
      status: [
        {text: "non connecté", bgClass: "bg-red"},
        {text: "connecté", bgClass: "bg-green-medium"},
        {text: "spectateur", bgClass: "bg-yellow"},
      ]
    }
  },
  computed: {
    teamsConnected() {
      return this.gameStore.teams.filter(team => team.isConnected)
    },
    microNeeded() {
      return this.gameStore.data ? this.gameStore.data.gameSequences[this.gameStore.currentSequence].microNeeded : false
    },
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    }
  },
  methods: {
    openModal() {
      this.mainStore.openModal()
      this.isModalOpen = true
    },
    closeModal() {
      this.mainStore.closeModal()
      setTimeout(() => {this.isModalOpen = false}, 600)
    }
  }
});
</script>
