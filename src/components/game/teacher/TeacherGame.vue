<template>
  <div class="border-4 border-green-400">
    <InGame v-show="gameStore.currentStep === STEP.PLAY" :teamId="gameStore.teamId" @validated="validated"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {getSocket} from "../../../client";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import {EVENT, STEP} from "../../../common/Constants";

import InGame from "./InGame.vue";

export default defineComponent({
  name: 'InGameComponent',
  computed: {
    STEP() {
      return STEP
    }
  },
  components: {
    InGame
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore()
    }
  },
  mounted() {
    this.socket.emit(EVENT.LAUNCH_GAME, {
      roomId: this.mainStore.roomId,
      gameId: this.mainStore.getFullGameId
    });

    this.gameStore.$subscribe((mutation, state) => {
      if (this.gameStore.totalTeamsFinished === this.gameStore.totalTeams) {
        this.gameStore.currentStep = STEP.END;
        this.socket.emit(EVENT.GAME_VALIDATION, {
          roomId: this.mainStore.roomId
        })
      }
    });
  }
});
</script>

<style lang="scss" scoped>

</style>
