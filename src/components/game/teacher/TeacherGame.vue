<template>
  <div class="border-4 border-green-400">
    <Instruction :show="gameStore.currentStep === STEP.INSTRUCTION" :isTeacher="true"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {getSocket} from "../../../client";
import {EVENT, STEP} from "../../../common/Constants";
import Instruction from "../Instruction.vue";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";

export default defineComponent({
  name: 'InGameComponent',
  computed: {
    STEP() {
      return STEP
    }
  },
  components: {
    Instruction
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
