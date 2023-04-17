<template>
  <div class="bg-gray-100">
    <Instruction v-if="step === 0" :isTeacher="true" :gameData="gameData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSocket } from "../../../client";
import {EVENT} from "../../../common/Constants";
import Instruction from "../Instruction.vue";
import type { GameData } from '../../../common/Interfaces';
import gameData from "./../../../assets/game-data/game-data.json";

export default defineComponent({
  name: 'InGameComponent',
  components: {
    Instruction
  },
  data () {
    return {
      socket: getSocket(),
      gameData: gameData as GameData,
      step: 0 as number
    }
  },
  mounted() {
    this.socket.on(EVENT.START_GAME, () => {
      this.step = 1
    })
  }
});
</script>

<style lang="scss" scoped>

</style>
