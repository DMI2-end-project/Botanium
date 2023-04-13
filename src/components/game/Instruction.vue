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

export default defineComponent({
  name: 'InstructionComponent',
  props: {
    isTeacher: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    title(): String {
      return gameData[this.$route.params.id].instructionTitle
    },
    text(): String {
      return gameData[this.$route.params.id].instructionText
    }
  },
  methods: {
    next() {
      // TODO send next step to node server
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
