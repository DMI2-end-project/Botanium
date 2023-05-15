<template>
  <div class="signboard bg-signboard w-fit px-12 py-6 shadow-lg flex justify-center" :class="isRotate ? 'transform rotate-2' : ''">
    <h1 class="w-fit" :class="isRotate ? 'transform -rotate-2' : ''">{{ text }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SignboardComponent',
  props: {
    text: {
      default: 'Text',
      type: String
    },
    isRotate: {
      default: false,
      type: Boolean
    }
  },
  mounted() {
  },
  methods: {
  }
});
</script>

<style scoped>
.signboard {
  background-size: auto 100%;
}
</style>
