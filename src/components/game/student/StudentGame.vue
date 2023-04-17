<template>
  <div class="bg-gray-100">
    <Instruction v-if="step === 0" :gameData="gameData" />
    <InGame v-if="step === 1" :teamId="teamId" @validated="validated" :gameData="gameData" />
    <Waiting v-if="step === 2" :teamId="teamId" :gameData="gameData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSocket } from "../../../client";
import {EVENT} from "../../../common/Constants";
import Instruction from "./../Instruction.vue";
import InGame from "./InGame.vue";
import Waiting from "./Waiting.vue";
import type { GameData } from '../../../common/Interfaces';
import gameData from "./../../../assets/game-data/game-data.json";

export default defineComponent({
  name: 'InGameComponent',
  components: {
    Instruction,
    InGame,
    Waiting
  },
  emits: ['validated'],
  props: {
    teamId: {
      type: String,
      default: "1",
    }
  },
  data () {
    return {
      socket: getSocket(),
      gameData: gameData as GameData,
      step: 0 as number
    }
  },
  mounted() {
    // this.step += 1;
    this.socket.on(EVENT.START_GAME, () => {
      this.step = 1
    })
  },
  methods: {
    validated() {
      this.$emit('validated')
      this.step += 1;
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
