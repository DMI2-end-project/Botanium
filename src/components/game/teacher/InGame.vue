<template>
  <div>
    <GameHeader/>
    <component v-bind:is="GameView"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {GAMETYPE} from "../../../common/Constants";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";

import GameHeader from "../GameHeader.vue";
import MCQ from "./multiple-choice-test/GameView.vue";

export default defineComponent({
  name: 'InGameComponent',
  components: {
    GameHeader,
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  computed: {
    GameView() {
      if (this.gameStore.data) {
        switch (this.gameStore.data.gameType) {
          case GAMETYPE.MCQ:
            return MCQ;
          default:
            return;
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
