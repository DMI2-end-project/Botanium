<template>
  <div>
    <component v-bind:is="GameView" :data="$props.data"/>
  </div>
</template>

<script lang="ts">
import {Component, defineComponent} from 'vue'
import {getSocket} from "../../../client";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import {GAMETYPE} from "../../../common/Constants";

import MCQ from "./multiple-choice-test/GameView.vue";
import Rhythm from "./rhythm/GameView.vue";

// TODO : Error GameView

export default defineComponent({
  name: 'TeacherGame',
  props: {
    data: Object,
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore()
    }
  },
  computed: {
    GameView(): Component | undefined {
      let currentPart = this.$props.data?.games[this.gameStore.currentPart]
      switch (currentPart.type) {
        case GAMETYPE.DRAG_DROP:
          //return ;
        case GAMETYPE.MCQ:
          return MCQ;
        case GAMETYPE.RHYTHM:
          return Rhythm;
        case GAMETYPE.SWIPE:
          //return ;
        default:
          return;
      }
    }
  }
});
</script>
