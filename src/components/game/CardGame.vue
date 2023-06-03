<script setup lang="ts">
import {defineProps} from 'vue';

import Check from '../../assets/ico-check.svg?component';

const props = defineProps({
  state: {
    type: String,
    required: true,
    validator(value: string) {
      // The value must match one of these strings
      return ['hide', 'validated', 'show'].includes(value);
    }
  },
  isValid: {
    type: Boolean,
    default: undefined
  },
});

</script>

<template>
  <div class="w-full h-auto bg-beige flex flex-col justify-center items-center rounded-md border-4"
       :class="{
        'border-blue': props.isValid === true,
        'border-red': props.isValid === false,
        'border-beige': props.isValid === undefined,
        'bg-green border-green text-green-dark': props.state === 'validated'
       }">
    <div class=""
         :class="{
          'border-blue': props.isValid === true,
          'border-red': props.isValid === false,
          'border-beige': props.isValid === undefined,
          'bg-green border-green text-green-dark': props.state === 'validated'
         }">
      <slot name="recto" v-if="props.state === 'hide'" class=""/>
      <slot name="verso" v-if="props.state === 'show'" class=""/>
      <div v-if="props.state === 'validated'" class="bg-green text-white">
        <Check class="w-10 h-10"/>
      </div>
    </div>
  </div>
</template>