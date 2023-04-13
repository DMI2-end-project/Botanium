<template>
  <div class="bg-gray-100">
    <GameBar :teamId="teamId" />
    <GameView :teamId="teamId" @validated="validated" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameBar from "./GameBar.vue";
import GameView from "./multiple-choice-test/GameView.vue";
import { validate } from '@babel/types';

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
    }
  },
  methods: {
    validated() {
      this.$emit('validated')
      console.log('2')
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
