<template>
  <div class="flex flex-col gap-24 items-center text-green">
    <div class="w-full bg-green-light rounded-md flex gap-14 py-24 px-10">
      <div class="aspect-square shrink-0 w-36 bg-beige text-green rounded-full font-bold p-3">
        <span class="block w-full h-full flex justify-center items-center rounded-full border border-green bg-beige p-2">
          <img :src="publicPath + '/src/assets/game-data/icons/'+ mainStore.getFullGameId +'/' + icon" alt=""
               class="w-14 aspect-square">
        </span>
      </div>
      <div class=" flex flex-col gap-4 items-center">
        <h1>Bravo !</h1>
        <p class="">{{ text }}</p>
      </div>
    </div>
    <div v-show="gameStore.currentStep === STEP.WAIT" class=" bg-green text-white rounded-full flex justify-center items-center gap-5 p-2">
      <!-- absolute bottom-24 -->
      <div class="h-full aspect-square rounded-full bg-green-medium">
        <Loading class="w-8 aspect-square"/>
      </div>
      <p class="m-2">Patiente un peu, tes camarades réfléchissent encore</p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import {STEP} from "../../../common/Constants";

import Loading from "../../../assets/svg/ico-loading.svg?component";

export default defineComponent({
  name: 'WaitingComponent',
  props: {
    data: Object,
    teamId: Number
  },
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      publicPath: window.location.origin,
    }
  },
  computed: {
    STEP() {
      return STEP
    },
    tID() {
      return this.$props.teamId ? this.$props.teamId : 0;
    },
    text() {
      return this.$props.data?.gameContent[this.tID].congratulation;
    },
    icon() {
      return this.$props.data?.gameContent[this.tID].congratulationIcon;
    },
    waitingMessage() {
      return this.$props.data?.waitingMessage;
    }
  },
  mounted() {
  }
});
</script>

<style lang="scss" scoped>

</style>
