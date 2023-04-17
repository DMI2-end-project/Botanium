<template>
  <div class="bg-gray-100">
    <GameBar :teamId="teamId" :gameData="gameData" />
    <GameView :teamId="teamId" @validated="validated" :gameData="gameData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameBar from "./GameBar.vue";
import GameView from "./multiple-choice-test/GameView.vue";

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
    },
    gameData: {
      type: Object,
      default: {},
    }
  },
  emits: ['validated'],
  methods: {
    validated() {
      this.$emit('validated')
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
