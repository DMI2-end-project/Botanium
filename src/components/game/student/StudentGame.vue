<template>
  <div class="w-full h-full">
    <!--InGame v-show="gameStore.currentStep === GAMESTEP.PLAY" :data="$props.data" :teamId="gameStore.teamId"
            @validated="validated"/-->
    <div v-show="gameStore.currentStep === GAMESTEP.PLAY">
      <component v-bind:is="GameView" :data="$props.data" :teamId="gameStore.teamId"/><!--  @validated="validated" -->
    </div>
  </div>
</template>

<script lang="ts">
import {Component, defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {useGameStore} from "../../../stores/gameStore";
import {useMainStore} from "../../../stores/mainStore";
import {EVENT, GAME_TYPE, GAME_STEP} from "../../../common/Constants";
import {TeamManagerInstance} from "../../../common/TeamManager";

import DragDrop from "./drag-drop/GameView.vue";
import MCQ from "./multiple-choice-test/GameView.vue";
import Rhythm from "./rhythm/GameView.vue";
import Swipe from "./swipe/GameView.vue";

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
    GAMESTEP() {
      return GAME_STEP
    },
    GameView(): Component | undefined {
      let currentPart = this.$props.data?.gameSequences[this.gameStore.currentSequence];
      switch (currentPart.type) {
        case GAME_TYPE.DRAG_DROP:
          return DragDrop;
        case GAME_TYPE.MCQ:
          return MCQ;
        case GAME_TYPE.RHYTHM:
          return Rhythm;
        case GAME_TYPE.SWIPE:
          return Swipe;
        default:
        //return;
      }
    }
  },
  mounted() {
  },
  methods: {
    validated() {
      this.$emit('validated');
      TeamManagerInstance.teamValidation()
    }
  }
});
</script>

<style lang="scss" scoped>

</style>

<script setup lang="ts">
</script>