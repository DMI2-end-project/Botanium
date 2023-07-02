<script setup lang="ts">
import {COLOR, SIZE} from "../../common/Constants";
import RoundButton from "../common/RoundButton.vue";

import Eye from "../../assets/svg/ico-eye.svg?component";
import {leading} from "../../common/Lib";

const props = defineProps({
  cardState: {
    type: String,
    default: 'show',
    validator(value: string) {
      // The value must match one of these strings
      return ['toDo', 'inProgress', 'pause', 'done'].includes(value);
    }
  },
  index: {
    type: Number,
    required: true
  },
  item: Object
});

const getImage = () => {
  let chapterNumber = leading(props.index, 3);

  //return `/chapter/${chapterNumber}/preview-chapter-${chapterNumber}.png`;
  return `/chapter/001/preview-chapter-001.png`;
}

</script>

<template>
  <div class="flex flex-col gap-3.5 font-semibold p-2">
    <div class="flex justify-between items-center rounded-lg p-2"
         :class="cardState === 'done' ? 'bg-blue/70' : ' bg-green-medium/70'">
      <div class="flex flex-col">
        <span class="font-semibold text-xs">Thématique</span>
        <p class="text-beige leading-tight">{{ props.item ? props.item.thematic : '' }}</p>
      </div>
      <p class=" text-beige">{{ index }}</p>
    </div>
    <div class="flex gap-5">
      <div class="w-20 h-20 aspect-square shrink-0 rounded-full overflow-hidden">
        <img class="w-full h-full object-cover object-center" :src="getImage()" alt=""/>
      </div>
      <div class="flex flex-col gap-1.5">
        <span>Chapitre</span>
        <span class="leading-tight"
              :class="cardState === 'done' ? 'text-blue' : 'text-green-medium'">{{ props.item? props.item.title : '' }}</span>
      </div>
      <RoundButton class="self-end ml-auto" :color="cardState === 'done' ? COLOR.BLUE : COLOR.GREEN_MEDIUM_BEIGE"
                   :size="SIZE.XS" :number="-1">
        <Eye class="w-10"/>
      </RoundButton>
    </div>
  </div>
</template>
