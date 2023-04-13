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
import { defineComponent } from 'vue'
import gameData from "../../../assets/game-data/game-data.json";

export default defineComponent({
  name: 'BarComponent',
  props: {
    teamId: {
      type: String,
      default: "1",
    }
  },
  data () {
    return {
      publicPath: window.location.origin,
      text: gameData[this.$route.params.id].gameContent[this.$props.teamId].instruction,
    }
  },
});
</script>

<style lang="scss" scoped>

</style>
