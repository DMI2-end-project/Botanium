<template>
  <div class="relative flex flex-col items-center">
    <h1 class="translate-y-[20%] flex flex-col items-center">
      <span class="inline-block bg-beige-medium text-green shadow-lg p-4 z-10">Enigme n°1</span>
      <span class="inline-block bg-beige-medium text-purple shadow-lg p-4 rotate-[1.80deg]">{{ title }}</span>
    </h1>
    <div class="flex flex-col items-center gap-6 bg-green rounded-md p-16">
      <h3 class="text-beige">{{ text }}</h3>
      <button v-if="mainStore.role === ROLE.TEACHER" @click="next">Suivant</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../client";
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";
import {EVENT, ROLE, STEP} from "../../common/Constants";

import gameData from "./../../assets/game-data/game-data.json";

import Breadcrumb from "../Breadcrumb.vue";

export default defineComponent({
  name: 'InstructionComponent',
  components: {Breadcrumb},
  props: {
    data: Object
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  computed: {
    ROLE() {
      return ROLE
    },
    title() {
      return this.$props.data?.instructionTitle
    },
    text() {
      return this.$props.data?.instructionText
    }
  },
  mounted() {
    if (this.mainStore.role === ROLE.TEACHER) {
      this.socket.emit(EVENT.LAUNCH_GAME, {
        roomId: this.mainStore.roomId,
        gameId: this.mainStore.gameId
      });
    }
  },
  methods: {
    next() {
      this.socket.emit(EVENT.START_GAME, {
        roomId: this.mainStore.roomId,
        step: STEP.PLAY
      });
      this.gameStore.currentStep = STEP.PLAY;
      console.log('next', this.mainStore.roomId, this.gameStore.currentStep)
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
