<template>
  <div class="flex flex-col gap-24 items-center text-green">
    <div class="w-full bg-green-light rounded-md grid grid-cols-3 py-24 px-10"> <!-- flex gap-14 -->
      <div class="col-span-1 w-full h-full">
        <RoundItem :color="COLOR.GREEN_MEDIUM">
          <Loading/>
        </RoundItem>
      </div>
      <div class="col-span-2 flex flex-col gap-4 items-center">
        <h1>Bravo !</h1>
        <p class="">{{ text }}</p>
      </div>
    </div>
    <Info v-show="gameStore.currentStep === GAMESTEP.WAIT" text="Patiente un peu, tes camarades réfléchissent encore">
      <Loading class="loading w-8 aspect-square"/>
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

<style scoped>
.loading {
    animation-name: rotate;
    animation-duration: 1s; /* Durée totale de l'animation */
    animation-iteration-count: infinite; /* Boucle infinie */
    animation-timing-function: steps(16); /* Pas de transition entre les étapes */
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
