<template>
  <div v-show="gameStore.currentStep === GAMESTEP.PLAY">
    <component v-bind:is="GameView" @validated="validated"/>
  </div>
</template>

<script lang="ts">
import {Component, defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {useGameStore} from "../../../stores/gameStore";
import {useMainStore} from "../../../stores/mainStore";
import {GAME_STEP, GAME_TYPE} from "../../../common/Constants";
import {TeamManagerInstance} from "../../../common/TeamManager";

import DragDrop from "./drag-drop/GameView.vue";
import MCQ from "./multiple-choice-test/GameView.vue";
import Rhythm from "./rhythm/GameView.vue";
import Swipe from "./swipe/GameView.vue";
import Cursor from "./cursor/GameView.vue";

export default defineComponent({
  name: 'StudentGame',
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  emits: ["validated"],
  computed: {
    GAMESTEP() {
      return GAME_STEP
    },
    GameView(): Component | undefined {
      let currentPart = this.gameStore.data?.gameSequences[this.gameStore.currentSequence];
      if (currentPart) {
        switch (currentPart.type) {
          case GAME_TYPE.DRAG_DROP:
            return DragDrop;
          case GAME_TYPE.MCQ:
            return MCQ;
          case GAME_TYPE.RHYTHM:
            return Rhythm;
          case GAME_TYPE.SWIPE:
            return Swipe;
          case GAME_TYPE.CURSOR:
            return Cursor;
          default:
          //return;
        }
      }
    }
  },
  methods: {
    async validated() {
      this.$emit('validated');
      this.gameStore.currentStep = GAME_STEP.WAIT;
      await TeamManagerInstance.teamValidation();
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
