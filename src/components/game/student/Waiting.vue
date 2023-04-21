<template>
  <div>
    <div class="flex flex-col justify-between items-center bg-gray-200 p-10">
      <div class="rounded-full bg-white p-5">
        <img :src="publicPath + '/src/assets' + icon" alt="" class="w-16 h-16">
      </div>
      <p class="mt-5 uppercase font-bold">Bravo !</p>
      <p>C’est la bonne réponse</p>
      <p class="">{{ text }}</p>
      <div v-if="gameStore.currentStep === STEP.WAIT" class="bg-white mt-10 p-5 rounded-xl"><p>{{ waitingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import gameData from "../../../assets/game-data/game-data.json";
import {STEP} from "../../../common/Constants";
import {useGameStore} from "../../../stores/gameStore";

export default defineComponent({
  name: 'WaitingComponent',
  data() {
    return {
      gameStore: useGameStore(),
      publicPath: window.location.origin,
    }
  },
  computed: {
    STEP() {
      return STEP
    },
    text() {
      if (this.gameStore.teamId) {
        return this.gameStore.data.gameContent[this.gameStore.teamId].congratulation
      }
    },
    icon() {
      if (this.gameStore.teamId) {
        return this.gameStore.data.gameContent[this.gameStore.teamId].congratulationIcon
      }
    },
    waitingMessage() {
      if (this.gameStore.teamId) {
        return this.gameStore.data[this.gameStore.teamId].waitingMessage
      }
    }
  },
  mounted() {
  }
});
</script>

<style lang="scss" scoped>

</style>
