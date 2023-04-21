<template>
  <div>
    <div class="flex justify-between items-center bg-gray-200 p-3">
      <p class="w-full">{{ text }}</p>
      <div>
        <button>Memo</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useGameStore} from "../../../stores/gameStore";

export default defineComponent({
  name: 'GameHeaderComponent',
  props: {
    teamId: {
      type: String,
      default: "1",
    },

  },
  data() {
    return {
      gameStore: useGameStore(),
      publicPath: window.location.origin,
    }
  },
  computed: {
    text() {
      if (this.gameStore.teamId) {
        console.log('GameHeader computed', this.gameStore.data.gameContent[this.gameStore.teamId])
        return this.gameStore.data.gameContent[this.gameStore.teamId].instruction
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
