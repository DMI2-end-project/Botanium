<script setup lang="ts">
import {BTN_COlOR} from "../common/Constants";

const props = defineProps(['label', 'icon', 'type', 'color']);

let containerClass = '';
let spanClass = '';
switch (props.color) {
  case BTN_COlOR.PINK:
    containerClass += ' bg-pink';
    spanClass += ' border-beige bg-pink';
    break;
  case BTN_COlOR.GREEN:
    containerClass += ' text-green bg-green-light';
    spanClass += ' border-green bg-green-light';
    break;
  default:
    break
}
</script>
<template>
  <button class="aspect-square rounded-full p-1.5" :class="containerClass">
      <span :class="spanClass"
          class="block w-full aspect-square flex justify-center items-center rounded-full border p-2">
        <!--Arrow class="w-14 aspect-square"/-->
        <component :is="props.icon" class="aspect-square w-10"/>
        {{ props.label }}
      </span>
  </button>
</template>
<style scoped>

</style>