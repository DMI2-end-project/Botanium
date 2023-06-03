<script setup lang="ts">
import {defineProps} from 'vue';

import Check from '../../assets/svg/ico-check-transparency.svg?component';

const props = defineProps({
  cardState: {
    type: String,
    default: 'show',
    validator(value: string) {
      // The value must match one of these strings
      return ['hide', 'validated', 'show'].includes(value);
    }
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

</script>

<template>
  <!-- BORDER ONLY FOR SELECTED - NO BACKGROUND -->
  <div class="w-full h-auto rounded-lg border p-2"
       :class="{
         'border-green-light' : props.answerState === 'selected',
         'border-transparent' : props.answerState !== 'selected'
       }">
    <!-- BORDER ONLY FOR VALID/ERROR -->
    <div class="w-full h-full rounded-lg border-[6px] p-2"
         :class="{
           'bg-beige border-blue': props.answerState === 'valid',
           'bg-beige border-red': props.answerState === 'error',
           'bg-beige border-transparent': props.answerState === 'none',
           'bg-green-light border-transparent text-green': props.cardState === 'validated',
           'bg-green-light border-transparent text-green': props.answerState === 'selected',
         }">
      <!-- BORDER -->
      <div class="w-full h-full flex flex-col justify-center items-center rounded-lg border p-2"
           :class="{
             'border-green-light text-green-light': props.cardState === 'validated',
             '': props.cardState !== 'validated',
             'border-transparent' : props.answerState === 'selected',
             'border-beige-medium' : props.answerState !== 'selected',
           }">
        <slot name="verso" v-if="props.cardState === 'hide'" class=""/>
        <slot name="recto" v-if="props.cardState === 'show'" class=""/>
        <div v-show="props.cardState === 'validated'">
          <Check class="aspect-square w-16"/>
        </div>
      </div>
    </div>
  </div>
</template>