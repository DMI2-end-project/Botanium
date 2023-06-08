<template>
  <button class="p-0 w-full bg-transparent outline-none border-none group flex flex-col items-center">
    <div class="w-20 h-20 p-2 text-beige-dark flex flex-col justify-center items-center rounded-full transition group-hover:shadow-xl" :class="(isSelect ? 'shadow-xl ' : '') + (isReverse ? 'text-white bg-beige-dark' : 'bg-white')"><slot/></div>
    <p class="font-bold transition group-hover:text-green" :class="(isSelect ? 'text-green ' : 'text-white ') + (isReverse ? 'text-green' : '')">{{ text }}</p>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RoundButton',
  props: {
    text: {
      default: "",
      type: String
    },
    isSelect: {
      default: false,
      type: Boolean
    },
    isReverse: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      containerClass: '',
      bgClass: '',
      textClass: '',
    }
  },
  mounted() {
  },
  methods: {}
});
</script>

<style>
</style>
