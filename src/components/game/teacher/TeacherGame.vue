<template>
  <component v-bind:is="GameView"/>
</template>

<script lang="ts">
import {Component, defineComponent} from 'vue'
import {getSocket} from "../../../client";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import {GAME_TYPE} from "../../../common/Constants";

import DragDrop from "./drag-drop/GameView.vue";
import MCQ from "./multiple-choice-test/GameView.vue";
import Rhythm from "./rhythm/GameView.vue";
import Cursor from "./cursor/GameView.vue";

// TODO : localStorage.setItem('currentParagraph', ???)

export default defineComponent({
  name: 'TeacherGame',
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore()
    }
  },
  computed: {
    GameView(): Component | undefined {
      let currentPart = this.gameStore.data?.gameSequences[this.gameStore.currentSequence]
      console.log('TEACHER GAME GameView', currentPart)
      switch (currentPart.type) {
        case GAME_TYPE.DRAG_DROP:
          return DragDrop;
        case GAME_TYPE.MCQ:
          return MCQ;
        case GAME_TYPE.RHYTHM:
          return Rhythm;
        case GAME_TYPE.CURSOR:
          return Cursor;
        default:
          return;
      }
    }
  }
});
</script>
