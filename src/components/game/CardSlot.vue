<script setup lang="ts">
import {defineProps, inject, onMounted, Ref, ref} from "vue";
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";

const mainStore = useMainStore();
const gameStore = useGameStore();

const props = defineProps({
  text: String,
  image: String,
  droppable: {
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

const slotValue = ref();
const slotRefs: Ref = inject('slotRefs') as Ref;
console.log('slotRefs', slotRefs, slotRefs.value);

onMounted(() => {
  if (props.droppable) {
// Store the ref in the slotRefs array
    (slotRefs.value as any[]).push(slotValue);
  }
});

/*
* TODO :  CONTAINER ID || REF ?
* TODO :  DROPPABLE
*   */
</script>

<template>
  <!-- OUTLINE DASHED - NO BACKGROUND -->
  <!-- outline-4 outline-offset-8 outline-dashed -->
  <div class="relative rounded-lg border-4 border-blue">
    <div
        class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[111%] h-[105%] border border-dashed opacity-30 rounded-lg z-0"
        :class="{'border-white ' : outline, 'border-transparent ' : !outline}"
        style="z-index: -1"/>
    <!-- INNER SHADOW - BACKGROUND COLOR -->
    <div class="w-full h-full flex flex-col rounded-lg p-2"
         :class="{
            'bg-background shadow-inner' : background,
            'bg-beige' : !background,
            'bg-red' : answerState === 'error',
            'bg-blue' : answerState === 'valid',
         }">
      <slot :ref="slotValue"/>
    </div>
  </div>
</template>