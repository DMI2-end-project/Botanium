<template>
  <Breadcrumb/>
  <div class="w-full h-full bg-green-medium !text-beige flex flex-col items-center justify-center my-auto gap-5 p-5">
    <div class="bg-green rounded-md p-16">
      <h1><span class="block bg-beige-medium shadow-lg p-4">{{ title }}</span></h1>
      <h3>{{ text }}</h3>
    </div>
    <button v-if="mainStore.role === ROLE.TEACHER" @click="next">Suivant</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {getSocket} from "../../client";
import {useMainStore} from "../../stores/mainStore";
import {EVENT, ROLE, STEP} from "../../common/Constants";

import gameData from "./../../assets/game-data/game-data.json";
import {useGameStore} from "../../stores/gameStore";
import Breadcrumb from "./Breadcrumb.vue";

export default defineComponent({
  name: 'InstructionComponent',
  components: {Breadcrumb},
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
      return this.gameStore.data.instructionTitle
    },
    text() {
      return this.gameStore.data.instructionText
    }
  },
  methods: {
    next() {
      this.socket.emit(EVENT.START_GAME, {
        roomId: this.mainStore.roomId
      });
      this.gameStore.currentStep = STEP.PLAY
      console.log('next',this.gameStore.currentStep )
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
