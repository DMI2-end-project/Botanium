<template>
  <div class="flex flex-col items-center w-fit" :style="`height: ${height}px`">
    <div class="bg-beige px-6 py-2 w-fit transform -rotate-3"><p class="w-fit font-bold">{{ text }}</p></div>
    <div class="h-full w-4 bg-beige-dark border-r-4 border-black/20" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TeamSignboardComponent',
  props: {
    text: {
      default: 'Team',
      type: String
    },
    height: {
      default: 90,
      type: Number
    }
  },
  mounted() {
  },
  methods: {
  }
});
</script>

<style>

</style>
