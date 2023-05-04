<template>
  <div class="w-full h-full">
    <!--InGame v-show="gameStore.currentStep === STEP.PLAY" :data="$props.data" :teamId="gameStore.teamId"
            @validated="validated"/-->
    <div v-show="gameStore.currentStep === STEP.PLAY">
      <component v-bind:is="GameView" :data="$props.data" :teamId="gameStore.teamId" @validated="validated"/>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {useGameStore} from "../../../stores/gameStore";
import {useMainStore} from "../../../stores/mainStore";
import {EVENT, GAMETYPE, STEP} from "../../../common/Constants";

import Waiting from "./Waiting.vue";
import MCQ from "./multiple-choice-test/GameView.vue";
import Rhythm from "./rhythm/GameView.vue";

export default defineComponent({
  name: 'StudentGame',
  props: {
    data: Object,
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  computed: {
    STEP() {
      return STEP
    },
    GameView(): Component | undefined {
      switch (this.gameStore.data?.gameType) {
        case GAMETYPE.MCQ:
          return MCQ;
        case GAMETYPE.Rhythm:
          return Rhythm;
        default:
          return;
      }
    }
  },
  mounted() {
    this.socket.on(EVENT.START_GAME, () => {
      this.gameStore.currentStep = STEP.PLAY;
    });
    this.socket.on(EVENT.START_GAME, () => {
      this.gameStore.currentStep = STEP.PLAY;
    });
  },
  methods: {
    validated() {
      this.$emit('validated');
      this.gameStore.currentStep = STEP.WAIT;
      this.socket.emit(EVENT.TEAM_VALIDATION, {
        roomId: this.mainStore.roomId,
        teamId: this.gameStore.teamId
      });
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
