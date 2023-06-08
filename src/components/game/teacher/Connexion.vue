<template>
  <div>
    <CircleButton @click="openModal" text="Connexion"><Wifi /></CircleButton>
  </div>

  <ModalView v-if="isModalOpen" close>
    <div class="relative flex flex-col items-center">
      <div class="bg-beige rounded-full aspect-square p-7 -mt-20 -mb-8">
        <p class="font-title font-bold text-2xl text-green-medium -mt-4">{{ teamsConnected.length }} / {{ gameStore.teams.length }}</p>
      </div>
      <h2 class="font-title font-bold text-2xl">Tablettes connectées</h2>
      <div class="flex flex-col items-center gap-3 my-8">
        <div v-for="team in gameStore.teams" :v-bind="team._socketId"
        :class="team.isConnected ? (microNeeded && !team.hasMicro ? 'bg-yellow' : 'bg-green-medium') : 'bg-red'" class="text-beige w-fit pl-4 pr-8 py-1 rounded-full flex items-center">
          <div v-if="microNeeded">
            <Loading v-if="team.hasMicro === null" class="loading-animation h-6 mr-4" />
            <MicroOn v-else-if="team.hasMicro" class="h-6 mr-4" />
            <MicroOff v-else-if="!team.hasMicro" class="h-6 mr-4" />
          </div>
          <p class="pl-4">{{ team._name }}</p>
        </div>
      </div>

      <div class="flex justify-center gap-6 mt-8">
        <div v-for="stat in status" :v-bind="stat.text" class="flex items-center">
          <span :class="stat.bgClass" class="aspect-square w-4 h-4 rounded-full mr-2" />
          <p class="text-sm">{{ stat.text }}</p>
        </div>
      </div>
    </div>
  </ModalView>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../../stores/gameStore";
import {useMainStore} from "../../../stores/mainStore";
import Wifi from "./../../../assets/svg/ico-wifi.svg?component";
import Cross from "./../../../assets/svg/ico-cross.svg?component";
import MicroOn from "./../../../assets/svg/ico-micro-on.svg?component";
import MicroOff from "./../../../assets/svg/ico-micro-off.svg?component";
import Loading from "./../../../assets/svg/ico-loading.svg?component";
import ModalView from "../../common/ModalView.vue";
import RoundButton from "../../common/RoundButton.vue";
import CircleButton from "../../common/CircleButton.vue";
import { leading } from '../../../common/Lib';
import { COLOR, SIZE } from '../../../common/Constants';

export default defineComponent({
  name: 'InstructionComponent',
  components: {Wifi, ModalView, RoundButton, CircleButton, Cross, MicroOn, MicroOff, Loading},
  data() {
    return {
      gameStore: useGameStore(),
      mainStore: useMainStore(),
      isModalOpen: false,
      status: [
        { text: "non connecté", bgClass: "bg-red" },
        { text: "connecté", bgClass: "bg-green-medium" },
        { text: "spectateur", bgClass: "bg-yellow" },
      ]
    }
  },
  computed: {
    teamsConnected() {
      return this.gameStore.teams.filter(team => team.isConnected)
    },
    microNeeded() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].microNeeded
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
      this.mainStore.isModalOpen = true;
      this.isModalOpen = true
    },
    closeModal() {
      this.mainStore.isModalOpen = false;
      this.isModalOpen = false
    }
  }
});
</script>
