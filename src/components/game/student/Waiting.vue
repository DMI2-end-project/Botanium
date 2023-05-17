<template>
  <div class="flex flex-col gap-24 items-center text-green">
    <div class="w-full bg-green-light rounded-md flex gap-14 py-24 px-10">
      <RoundItem :color="COLOR.GREEN_MEDIUM" :size="SIZE.XL">
        <Loading/>
      </RoundItem>
      <div class=" flex flex-col gap-4 items-center">
        <h1>Bravo !</h1>
        <p class="">{{ text }}</p>
      </div>
    </div>
    <Info v-show="gameStore.currentStep === GAMESTEP.WAIT" text="Patiente un peu, tes camarades réfléchissent encore">
      <Loading class="w-8 aspect-square"/>
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
      return this.$props.teamId ? this.$props.teamId : 0;
    },
    currentSection() {
      return this.$props.data?.gameSequences[this.gameStore.currentSequence]
    },
    text() {
      return this.currentSection.teams[this.currentSection.teamsNeeded ? this.tID : 0].congratulation?.text;
      //return this.$props.data?.gameContent[this.tID].congratulation;
    },
    icon() {
      return this.currentSection.teams[this.currentSection.teamsNeeded ? this.tID : 0].congratulation.icon;
      //return this.$props.data?.gameContent[this.tID].congratulationIcon;
    },
    waitingMessage() {
      return this.$props.data ? this.$props.data.waitingMessage : "Patiente un peu, tes camarades réfléchissent encore...";
    }
  },
  mounted() {
  }
});
</script>

<style lang="scss" scoped>

</style>
