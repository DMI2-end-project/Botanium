<template>
  <div class="w-full h-full bg-white flex flex-col items-center justify-center my-auto gap-5 p-5">
    <div class="p-8 bg-gray-200">
      <p>{{ title }}</p>
      <p>{{ text }}</p>
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

export default defineComponent({
  name: 'InstructionComponent',
  computed: {
    ROLE() {
      return ROLE
    }
  },
  props: {},
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      title: gameData[this.$route.params.id].instructionTitle,
      text: gameData[this.$route.params.id].instructionText
    }
  },
  methods: {
    next() {
      this.socket.emit(EVENT.START_GAME, {
        roomId: this.mainStore.roomId
      });
      this.gameStore.currentStep = STEP.PLAY
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
