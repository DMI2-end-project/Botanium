<template>
  <div class="relative flex flex-col items-center">
    <h1 class="translate-y-[20%] flex flex-col items-center">
      <span class="inline-block bg-beige-medium text-green shadow-lg p-4 z-10">Enigme n°{{ mainStore.gameId }}</span>
      <span class="inline-block bg-beige-medium text-purple shadow-lg p-4 rotate-[1.80deg]">{{ title }}</span>
    </h1>
    <div class="flex flex-col items-center gap-6 bg-green rounded-md p-16 mb-8">
      <h3 class="text-beige">{{ text }}</h3>
    </div>
    <Button v-show="mainStore.role === ROLE.TEACHER" @click="next" label="Suivant" :color="BTN_COlOR.PINK"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../client";
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";
import {BTN_COlOR, EVENT, ROLE, STEP} from "../../common/Constants";

import gameData from "./../../assets/game-data/game-data.json";

import Breadcrumb from "../Breadcrumb.vue";
import Button from "../Button.vue";

export default defineComponent({
  name: 'InstructionComponent',
  components: {Button, Breadcrumb},
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
    BTN_COlOR() {
      return BTN_COlOR
    },
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
    // Already done in Game.vue
    // if (this.mainStore.role === ROLE.TEACHER) {
    //   this.socket.emit(EVENT.LAUNCH_GAME, {
    //     roomId: this.mainStore.roomId,
    //     gameId: this.mainStore.gameId
    //   });
    // }
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
