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
import gameData from "./../../assets/game-data/game-data.json";
import { getSocket } from "../../client";
import EVENT from "../../constants/EVENT";

export default defineComponent({
  name: 'InstructionComponent',
  props: {
    isTeacher: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      socket: getSocket(),
      title: gameData[this.$route.params.id].instructionTitle,
      text: gameData[this.$route.params.id].instructionText
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
