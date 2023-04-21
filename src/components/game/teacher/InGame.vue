<template>
  <div class="bg-gray-100">
    <GameBar :teamId="teamId"/>
    <component v-bind:is="GameView" :teamId="teamId" @validated="validated"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {getSocket} from "../../../client";
import {EVENT, GAMETYPE, STEP} from "../../../common/Constants";
import GameHeader from "./GameHeader.vue";
import MCQ from "./multiple-choice-test/GameView.vue";

import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";

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
      switch (this.gameStore.data.gameType) {
        case GAMETYPE.MCQ:
          return MCQ;
        default:
          return;
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
      this.$emit('validated')
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
