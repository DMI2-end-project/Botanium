<script setup lang="ts">
import CardGame from "../components/game/CardGame.vue";
</script>

<template>
  <div class="w-full h-full flex-1 grid grid-cols-2 items-start gap-8">
    <CardGame card-state="validated" answer-state="selected">
      <template v-slot:recto>
        <!-- content for the header slot -->
        Test 1
      </template>
      <template v-slot:verso>
        <!-- content for the header slot -->
        Test 2
      </template>
    </CardGame>
  </div>
</template>