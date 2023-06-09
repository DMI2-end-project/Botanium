<script setup lang="ts">
import {defineProps} from "vue";
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";

const mainStore = useMainStore();
const gameStore = useGameStore();

const props = defineProps({
  outline: {
    type: Boolean,
    default: false
  },
  answerState: {
    type: String,
    default: 'none',
    validator(value: string) {
      // The value must match one of these strings
      return ['valid', 'error', 'selected', 'none'].includes(value);
    }
  },
});

/*
* TODO :  CONTAINER ID || REF ?
* TODO :  DROPPABLE
*   */
</script>

<template>
  <!-- OUTLINE DASHED - NO BACKGROUND -->
  <div class="rounded-lg outline-4 outline-offset-8 outline-dashed"
       :class="{'outline-white ' : outline, 'outline-transparent ' : !outline}">
    <!-- INNER SHADOW - BACKGROUND COLOR -->
    <div class="w-full h-full bg-background rounded-lg shadow-inner p-2"
         :class="{
            'bg-red' : answerState === 'error',
            'bg-blue' : answerState === 'valid',
         }">
      <slot/>
    </div>
  </div>
</template>