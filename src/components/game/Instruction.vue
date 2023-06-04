<template>
  <div class="relative flex flex-col items-center text-center">
    <div class="flex flex-col items-center">
      <SignboardVue :text="'Enigme n°' + mainStore.gameId" class="z-10" />
      <SignboardVue :text="title" :is-rotate="true" class="text-purple min-w-[25vw] -mt-3" />
    </div>
    <div class="w-full flex flex-col items-center gap-6 bg-green rounded-md p-28 -mt-6">
      <h3 class="text-beige">{{ text }}</h3>
    </div>
    <RoundButton v-if="mainStore.role === ROLE.TEACHER" @click="next" :color="COLOR.PINK" class="mt-8 text-lg font-bold">
      >
    </RoundButton>
    <CircleButton v-if="mainStore.role === ROLE.STUDENT && microNeeded" @click="startMicrophone" class="mt-10" text="Allume ton micro" :color="COLOR.PURPLE" :size="SIZE.MD" :colorReverse="true"><MicroOn /></CircleButton>
  </div>
  <!-- <ModalView v-if="isModalOpen">
    <div class="relative my-2 flex flex-col items-center">
      <h1 class="mt-8">Indice :</h1>
    </div>
  </ModalView> -->
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";
import { COLOR, ROLE, SIZE } from "../../common/Constants";
import { GameMasterManagerInstance } from "../../common/GameMasterManager";

import SignboardVue from "../common/Signboard.vue";
import RoundButton from "../common/RoundButton.vue";
import CircleButton from "../common/CircleButton.vue";
import ModalView from "../common/ModalView.vue";

import MicroOn from "./../../assets/svg/ico-micro-on.svg?component";

export default defineComponent({
  name: 'InstructionComponent',
  components: {SignboardVue, RoundButton, CircleButton, ModalView, MicroOn},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      streamAudio: null as MediaStream | null,
      isModalOpen: false,
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    },
    ROLE() {
      return ROLE
    },
    title() {
      return this.gameStore.data?.introduction.title
    },
    text() {
      return this.gameStore.data?.introduction.text
    },
    microNeeded() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].microNeeded
    }
  },
  methods: {
    next() {
      GameMasterManagerInstance.startGame()
    },
    async startMicrophone() {
      try {
          this.streamAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {

        }
    },
    openModal() {
      this.mainStore.isModalOpen = true;
      this.isModalOpen = true;
    },
    closeModal() {
      this.mainStore.isModalOpen = false;
      this.isModalOpen = false;
    }
  }
});
</script>
