<template>
  <div class="flex flex-col items-center w-fit" :style="`height: ${height}`">
    <div class="bg-beige px-6 py-2 w-fit transform -rotate-3">
      <span class="w-fit font-bold text-center">{{ gameStore.teamName ? gameStore.teamName : 'Team'}}</span>
    </div>
    <div class="h-full w-4 bg-beige-dark border-r-4 border-black/20"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useGameStore} from "../../stores/gameStore";

export default defineComponent({
  name: 'TeamSignboard',
  props: {
    height: {
      default: "90px",
      type: String
    }
  },
  data() {
    return {
      gameStore: useGameStore(),
    }
  },
  mounted() {
  },
  methods: {useGameStore}
});
</script>

<style>

</style>
