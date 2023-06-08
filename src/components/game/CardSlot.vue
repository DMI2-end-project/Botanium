<script setup lang="ts">
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";

const mainStore = useMainStore();
const gameStore = useGameStore();
</script>

<template>
  <div>
    <slot/>
  </div>
</template>