<script setup lang="ts">
import {COLOR, SIZE} from "../../common/Constants";
import RoundButton from "../common/RoundButton.vue";

import Eye from "../../assets/svg/ico-eye.svg?component";

const props = defineProps({
  cardState: {
    type: String,
    default: 'show',
    validator(value: string) {
      // The value must match one of these strings
      return ['toDo', 'inProgress', 'pause', 'done'].includes(value);
    }
  },
  index: Number,
  item: Object
});

</script>

<template>
  <div class="flex flex-col gap-3.5 font-semibold p-2">
    <div class="flex justify-between items-center bg-green-medium/70 rounded-lg p-2"
         :class="cardState === 'done' ? 'bg-blue/70' : ' bg-green-medium/70'">
      <div class="flex flex-col">
        <span class="font-semibold text-xs">Thématique</span>
        <p class="text-beige leading-tight">{{ props.item.thematic }}</p>
      </div>
      <p class=" text-beige">{{ index }}</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-5">
      <div class="w-10 h-10 lg:w-20 lg:h-20 aspect-square rounded-full bg-red">
      </div>
      <div class="flex flex-col gap-1.5">
        <span>Chapitre</span>
        <span class="leading-tight"
              :class="cardState === 'done' ? 'text-blue' : 'text-green-medium'">{{ props.item.title }}</span>
      </div>
      <RoundButton class="self-end" :color="cardState === 'done' ? COLOR.BLUE : COLOR.GREEN_MEDIUM_BEIGE"
                   :size="SIZE.XS">
        <Eye class="w-10"/>
      </RoundButton>
    </div>
  </div>
</template>