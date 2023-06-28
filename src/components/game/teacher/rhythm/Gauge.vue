<template>
  <div class="h-[55vh] w-52 m-12 ml-[15%] bg-beige overflow-hidden border-solid border-beige border-8 shadow-inner rounded-full relative">
    <div class="h-full bg-green-500 absolute rounded-md bottom-0 w-full"
         :style="`height: ${content}%;`"
         :class="{ 'bg-red-500': content > 100 }"></div>
    <div class="w-full absolute top-[20%] border-dashed border-b-4 border-green"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    content: {
      default: 0,
      type: Number,
    }
  },
  data() {
    return {
      capacity: 100 as number,
    }
  },
})
</script>
