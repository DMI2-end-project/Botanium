<script lang="ts" setup>
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import Scan from "../components/game/Scan.vue";

const mainStore = useMainStore();
const gameStore = useGameStore();

</script>

<template>
  <div class="relative flex w-full h-full flex-1 border-4 border-red">
   <Scan/>
  </div>
</template>