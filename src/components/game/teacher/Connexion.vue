<template>
  <div>
    <button @click="openModal" class="text-lg font-bold text-green bg-beige flex items-center rounded-full p-2 group hover:bg-green hover:text-beige transition">
      <div class="rounded-full border border-green aspect-square w-10 h-10 p-2 flex flex-col items-center transition group-hover:border-beige"><Wifi /></div>
      <p class="text-sm px-3">Connexion</p>
    </button>
  </div>

  <ModalView v-if="isModalOpen">
    <div class="relative flex flex-col items-center">
      <div class="absolute right-2 top-2"><RoundButton @click="closeModal" :color="COLOR.RED" :size="SIZE.SM"><Cross /></RoundButton></div>
      <div class="bg-beige rounded-full aspect-square p-7 -mt-20 -mb-8">
        <p class="font-title font-bold text-xxl text-green-medium -mt-4">{{ teamsConnected.length }} / {{ gameStore.teams.length }}</p>
      </div>
      <h2 class="font-title font-bold text-xxl">Tablettes connectées</h2>
      <div class="flex flex-col items-center gap-3 my-8">
        <div v-for="team in teamsConnected" :v-bind="team._socketId" class="bg-green-medium text-beige w-fit px-8 py-1 rounded-full">
          <p>{{ team._name }}</p>
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
import ModalView from "../../common/ModalView.vue";
import RoundButton from "../../common/RoundButton.vue";
import { leading } from '../../../common/Lib';
import { COLOR, SIZE } from '../../../common/Constants';

export default defineComponent({
  name: 'InstructionComponent',
  components: {Wifi, ModalView, RoundButton, Cross},
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
