<template>
  <div class="bg-gray-100">
    <Instruction v-if="step === 0" :isTeacher="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSocket } from "../../../client";
import {EVENT} from "../../../common/Constants";
import Instruction from "../Instruction.vue";

export default defineComponent({
  name: 'InGameComponent',
  components: {
    Instruction
  },
  data () {
    return {
      socket: getSocket(),
      step: 0
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
