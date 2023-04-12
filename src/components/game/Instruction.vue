<template>
  <div>Instruction {{ $route.params.id }} {{ teamId }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gameData from "./../../assets/game-data/game-data.json";

export default defineComponent({
  name: 'InstructionComponent',
  props: {
    teamId: {
      type: String,
      default: "1",
    }
  },
  data () {
    return {
    };
  },
  async mounted() {
    console.log(gameData[this.$route.params.id])
  },
  methods: {
  }
});
</script>

<style lang="scss" scoped>

</style>
