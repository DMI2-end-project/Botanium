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
import {TeamManagerInstance} from "../../../common/TeamManager";

import Waiting from "./Waiting.vue";
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
    STEP() {
      return STEP
    },
    GameView(): Component | undefined {
      let currentPart = this.$props.data?.games[this.gameStore.currentPart]
      switch (currentPart.type) {
        case GAMETYPE.DRAG_DROP:
          return DragDrop;
        case GAMETYPE.MCQ:
          return MCQ;
        case GAMETYPE.RHYTHM:
          return Rhythm;
        case GAMETYPE.SWIPE:
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
