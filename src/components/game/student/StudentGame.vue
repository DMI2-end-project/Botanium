<template>
  <div class="w-full h-full border-4 border-orange-400">
    <Instruction v-if="gameStore.currentStep === STEP.INSTRUCTION"/>
    <InGame v-if="gameStore.currentStep === STEP.PLAY" :teamId="gameStore.teamId" @validated="validated"/>
    <Waiting v-if="gameStore.currentStep === STEP.WAIT || gameStore.currentStep === STEP.END" :teamId="gameStore.teamId"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {useGameStore} from "../../../stores/gameStore";
import {EVENT, STEP} from "../../../common/Constants";

import Instruction from "./../Instruction.vue";
import InGame from "./InGame.vue";
import Waiting from "./Waiting.vue";

export default defineComponent({
  name: 'InGameComponent',
  computed: {
    STEP() {
      return STEP
    }
  },
  components: {
    Instruction,
    InGame,
    Waiting
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
      gameStore: useGameStore(),
      step: 0,
    }
  },
  mounted() {
    console.log('mounted')
    this.socket.on(EVENT.START_GAME, () => {
      this.gameStore.currentStep = STEP.PLAY;
    });
    this.socket.on(EVENT.START_GAME, () => {
      this.gameStore.currentStep = STEP.PLAY;
    });
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
