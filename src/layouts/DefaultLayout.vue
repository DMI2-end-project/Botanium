<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "DefaultLayout",
});
</script>

<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 bg-beige-medium flex flex-col py-4 lg:py-6">
    <header class="w-full flex items-center">
    </header>
    <main class="w-full h-full pb-6 lg:pb-10">
      <slot></slot>
    </main>
  </div>
</template>
