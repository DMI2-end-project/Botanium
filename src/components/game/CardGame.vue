<script setup lang="ts">
import {defineProps} from 'vue';

import Check from '../../assets/svg/ico-check-transparency.svg?component';
import Deco from '../../assets/svg/card-corner.svg?component';

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator(value: string) {
      // The value must match one of these strings
      return ['horizontal', 'vertical'].includes(value);
    }
  },
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
  <!-- TODO : DO OUTLINE -->
  <div class=" w-full h-auto rounded-lg border shrink-0 text-center p-2"
       :class="{
         'border-green-light' : props.answerState === 'selected',
         'border-transparent' : props.answerState !== 'selected'
       }">
    <!-- BORDER ONLY FOR VALID/ERROR -->
    <div class="w-full h-full bg-beige border-transparent rounded-lg border-[6px] p-1.5"
         :class="{
           'bg-beige !border-blue': props.answerState === 'valid',
           'bg-beige !border-red': props.answerState === 'error',
           'bg-beige border-transparent': props.answerState === 'none',
           'bg-green-light border-transparent text-green': props.cardState === 'validated' || props.answerState === 'selected',
         }">
      <!-- BORDER -->
      <div class="relative w-full h-full flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg border"
           :class="{
             '': props.cardState !== 'validated',
             'border-transparent' : props.answerState === 'selected',
             'border-beige-medium' : props.answerState !== 'selected',
             'bg-green-light border-green-medium text-green-medium': props.cardState === 'validated',
           }">
        <slot name="verso" v-if="props.cardState === 'hide'" class=""/>
        <slot name="recto" v-if="props.cardState === 'show'" class=""/>
        <div v-show="props.cardState === 'validated'">
          <Deco :class="{'w-[45%] ':mode === 'vertical', 'h-[45%] ': mode === 'horizontal'}"
                class="absolute aspect-square top-1 left-1 "/>
          <Deco :class="{'w-[45%] ':mode === 'vertical', 'h-[45%] ': mode === 'horizontal'}"
                class="absolute aspect-square top-1 right-1 -scale-x-100"/>
          <Deco :class="{'w-[45%] ':mode === 'vertical', 'h-[45%] ': mode === 'horizontal'}"
                class="absolute aspect-square bottom-1 left-1 -scale-y-100"/>
          <Deco :class="{'w-[45%] ':mode === 'vertical', 'h-[45%] ': mode === 'horizontal'}"
                class="absolute aspect-square bottom-1 right-1 -scale-100"/>
          <Check class="text-green aspect-square w-16"/>
        </div>
      </div>
    </div>
  </div>
</template>