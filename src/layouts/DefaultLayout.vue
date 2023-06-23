<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "DefaultLayout",
});
</script>

<template>
  <div class="bg-beige-medium min-h-screen flex flex-col">
    <header class="w-full flex items-center">
    </header>
    <main class="w-full h-full">
      <slot></slot>
    </main>
  </div>
</template>
