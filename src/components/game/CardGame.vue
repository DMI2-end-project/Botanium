<script setup lang="ts">
import {defineProps} from 'vue';

import Check from '../../assets/svg/ico-check-transparency.svg?component';

const props = defineProps({
  cardState: {
    type: String,
    required: true,
    default: 'show',
    validator(value: string) {
      // The value must match one of these strings
      return ['hide', 'validated', 'show'].includes(value);
    }
  },
  answerState: {
    type: String,
    required: true,
    default: 'none',
    validator(value: string) {
      // The value must match one of these strings
      return ['valid', 'error', 'selected', 'none'].includes(value);
    }
  },
});

</script>

<template>
  <div class="w-full h-auto bg-beige rounded-md border-4 p-2"
       :class="{
        'border-blue': props.answerState === 'valid',
        'border-red': props.answerState === 'error',
        'border-beige': props.answerState === 'none',
        'bg-green-medium border-green-medium': props.cardState === 'validated'
       }">
    <div class="w-full h-full rounded-md border flex flex-col justify-center items-center"
         :class="{
          'border-green-dark text-green-dark': props.cardState === 'validated',
          'border-beige-medium': props.cardState !== 'validated',
         }">
      <slot name="verso" v-if="props.cardState === 'hide'" class=""/>
      <slot name="recto" v-if="props.cardState === 'show'" class=""/>
      <div v-if="props.cardState === 'validated'">
        <Check class="aspect-square w-16"/>
      </div>
    </div>
  </div>
</template>