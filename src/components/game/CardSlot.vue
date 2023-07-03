<script setup lang="ts">
import {defineProps} from "vue";
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";

const mainStore = useMainStore();
const gameStore = useGameStore();

const props = defineProps({
  image: String,
  droppable: {
    type: Boolean,
    default: false
  },
  shadow: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  },
  background: {
    type: Boolean,
    default: false,
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
  <!-- CardSlot -->
  <!-- OUTLINE DASHED - NO BACKGROUND -->
  <!-- outline-4 outline-offset-8 outline-dashed -->
  <div class="relative rounded-lg">
    <div
        class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[111%] h-[105%] lg:w-[117%] lg:h-[110%] border-[3px] border-dashed rounded-lg opacity-30 z-0"
        :class="{'border-white ' : outline, 'border-transparent ' : !outline}"
        style="z-index: -1"/>
    <!-- INNER SHADOW - BACKGROUND COLOR -->
    <!--
    'bg-background shadow-inner' : background,
            'bg-beige' : !background,
    -->
    <div class="w-full h-full flex flex-col justify-center items-center rounded-lg p-2"
         :class="{
            'box' : shadow,
            'bg-red' : answerState === 'error',
            'bg-blue' : answerState === 'valid',
         }">
      <slot/>
    </div>
  </div>
</template>

<style>
.box {
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>