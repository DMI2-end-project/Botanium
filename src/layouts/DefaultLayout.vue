<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "DefaultLayout",
});
</script>

<template>
  <div class="bg-beige-medium min-h-screen flex flex-col py-4 lg:py-6">
    <header class="w-full flex items-center">
    </header>
    <main class="w-full h-full pb-6 lg:pb-10">
      <slot></slot>
    </main>
  </div>
</template>
