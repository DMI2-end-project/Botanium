<template>
  <div>
    <div class="p-8 bg-gray-200">
      <p>{{ title }}</p>
      <p>{{ text }}</p>
    </div>
    <button v-if="isTeacher" @click="next" class="m-5">Suivant</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSocket } from "../../client";
import { EVENT } from "../../common/Constants";

export default defineComponent({
  name: 'InstructionComponent',
  props: {
    isTeacher: {
      type: Boolean,
      default: false,
    },
    gameData: {
      type: Object,
      default: {},
    }
  },
  data() {
    return {
      socket: getSocket(),
      title: this.gameData[this.$route.params.id as string].instructionTitle as string,
      text: this.gameData[this.$route.params.id as string].instructionText as string
    }
  },
  methods: {
    next() {
      this.socket.emit(EVENT.START_GAME)
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
