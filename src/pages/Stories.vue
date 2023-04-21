<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import Card from "../components/Card.vue";

const mainStore = useMainStore();
let chapters = 2;

</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <div class="text-center">
      <h1>Capucine au monde des minuscules</h1>
      <h2>Choisissez le chapitre du jour</h2>
    </div>
    <div class="grid grid-cols-12 gap-4">
      <Card v-for="(c,i) in chapters" :chapterId="i+1" class="col-span-3" @click="mainStore.chapterId=i+1"/>
    </div>
  </div>
</template>

<style scoped>

</style>