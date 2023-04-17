<template>
  <div class="bg-gray-100">
    <GameBar :teamId="teamId"/>
    <GameView :teamId="teamId" @validated="validated"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {getSocket} from "../../../client";
import {EVENT, STEP} from "../../../common/Constants";

import GameBar from "./GameBar.vue";
import GameView from "./multiple-choice-test/GameView.vue";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";

export default defineComponent({
  name: 'InGameComponent',
  components: {
    GameBar,
    GameView
  },
  props: {
    teamId: {
      type: String,
      default: "1",
    }
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  methods: {
    validated() {
      this.gameStore.currentStep = STEP.WAIT;
      this.socket.emit(EVENT.TEAM_VALIDATION, {
        roomId: this.mainStore.roomId,
        teamId: this.gameStore.teamId
      })
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
