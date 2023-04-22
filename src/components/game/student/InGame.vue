<template>
  <div>
    <GameHeader/>
    <component v-bind:is="GameView" @validated="validated"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import {EVENT, GAMETYPE, STEP} from "../../../common/Constants";

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
  },
  emits: ['validated'],
  methods: {
    validated() {
      this.gameStore.currentStep = STEP.WAIT;
      this.socket.emit(EVENT.TEAM_VALIDATION, {
        roomId: this.mainStore.roomId,
        teamId: this.gameStore.teamId
      })
      this.$emit('validated');
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
