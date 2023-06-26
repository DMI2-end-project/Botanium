<template>
  <div class="flex flex-col gap-10 justify-around items-center text-green my-auto">
    <div class="w-full bg-green text-beige rounded-md grid grid-cols-3 gap-8 lg:gap-14 p-10"> <!-- flex -->
      <div class="col-span-1 w-full">
        <RoundItem v-if="congratulation?.icon" class="w-full aspect-square p-4 sm:p-12 lg:p-16" :color="COLOR.WHITE">
          <SvgIcon class="!w-full !h-full" :name="congratulation.icon"/>
        </RoundItem>
        <div v-if="congratulation?.image"
             :class="congratulation?.shape === 'circle' ? 'bg-beige rounded-full p-8' : ''">
          <img class="r" :src="`/game/images/${mainStore.getFullGameId}/${congratulation.image}`" :alt="congratulation.image"/>
        </div>
      </div>
      <div class="col-span-2 flex flex-col justify-center gap-4">
        <h1 v-if="congratulation?.title">{{ congratulation.title }}</h1>
        <p v-if="congratulation?.text" v-html=" congratulation.text"/>
      </div>
    </div>
    <Info class="transition-opacity" :class="gameStore.currentStep === GAMESTEP.WAIT ? '' : 'opacity-0'"
          text="Patiente un peu, tes camarades réfléchissent encore">
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
import SvgIcon from "../../common/SvgIcon.vue";
import CardGame from "../CardGame.vue";

export default defineComponent({
  name: 'WaitingComponent',
  components: {
    CardGame,
    Info,
    Loading,
    RoundItem,
    SvgIcon,
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
    congratulation() {
      return this.currentSection.teams[this.currentSection.teamsNeeded ? this.tID : 0].congratulation
    },
    waitingMessage() {
      return this.gameStore.data ? this.gameStore.data.waitingMessage : "Patiente un peu, tes camarades réfléchissent encore...";
    }
  },
  mounted() {
  }
});
</script>
