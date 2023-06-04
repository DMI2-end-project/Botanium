<template>
  <div class="flex flex-col gap-24 items-center text-green">
    <div class="w-full bg-green-light rounded-md grid grid-cols-3 gap-8 lg:gap-14 py-24 px-10"> <!-- flex -->
      <div class="col-span-1 w-full h-full">
        <RoundItem class="w-full aspect-square" :color="COLOR.GREEN_MEDIUM">
          <Loading/>
        </RoundItem>
      </div>
      <div class="col-span-2 flex flex-col gap-4">
        <h1>Bravo !</h1>
        <p class="">{{ text }}</p>
      </div>
    </div>
    <Info v-show="gameStore.currentStep === GAMESTEP.WAIT" text="Patiente un peu, tes camarades réfléchissent encore">
      <Loading class="loading-animation w-8 aspect-square"/>
    </Info>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import {GAME_STEP, SIZE, COLOR} from "../../../common/Constants";
import Loading from "../../../assets/svg/ico-loading.svg?component";
import Info from "../../common/Info.vue";
import RoundItem from "../../common/RoundItem.vue";

export default defineComponent({
  name: 'WaitingComponent',
  components: {
    Info, Loading, RoundItem
  },
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      publicPath: window.location.origin,
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    },
    GAMESTEP() {
      return GAME_STEP
    },
    tID() {
      return this.gameStore.teamId ? this.gameStore.teamId : 0;
    },
    currentSection() {
      return this.gameStore.data?.gameSequences[this.gameStore.currentSequence]
    },
    text() {
      return this.currentSection.teams[this.currentSection.teamsNeeded ? this.tID : 0].congratulation?.text;
    },
    icon() {
      return this.currentSection.teams[this.currentSection.teamsNeeded ? this.tID : 0].congratulation.icon;
    },
    waitingMessage() {
      return this.gameStore.data ? this.gameStore.data.waitingMessage : "Patiente un peu, tes camarades réfléchissent encore...";
    }
  },
  mounted() {
  }
});
</script>
