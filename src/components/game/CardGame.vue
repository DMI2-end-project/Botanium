<script setup lang="ts">
import Check from '../../assets/svg/ico-check-transparency.svg?component';
import Deco from '../../assets/svg/card-corner.svg?component';
import {watch} from "vue";
import {AudioManagerInstance} from "../../common/AudioManager";
import {AUDIO} from "../../common/Constants";

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

watch(() => props.cardState, async (newState, _) => {
  if (newState === 'validated') {
    AudioManagerInstance.play(AUDIO.GOOD_ANSWER_GROUP)
  }
});

watch(() => props.answerState, async (newAnswer, _) => {
  if (newAnswer === 'error') {
    AudioManagerInstance.play(AUDIO.WRONG_ANSWER_GROUP_TABLET);
  }

  if (newAnswer === 'valid') {
    console.log('valid')
    AudioManagerInstance.play(AUDIO.GOOD_ANSWER_GROUP_TABLET);
  }
});

</script>

<template>
  <!-- OUTLINE ONLY FOR SELECTED - NO BACKGROUND -->
  <!-- outline outline-offset-8 -->
  <!-- class="h-auto p-2" -->
  <div class="relative w-full h-full rounded-lg shrink-0">
    <div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[105%] h-[111%] border rounded-lg z-0"
         :class="{
         'border-green-light' : props.answerState === 'selected',
         'border-transparent' : props.answerState !== 'selected'
       }"/>
    <!-- BORDER ONLY FOR VALID/ERROR -->
    <div class="w-full h-full bg-beige border-transparent rounded-lg border-[6px] p-1.5"
         :class="{
           'bg-beige border-transparent': props.answerState !== 'selected',
           'bg-green-light border-transparent text-green': props.cardState === 'validated' || props.answerState === 'selected',
           'shake-animation-card' : answerState === 'error'
         }">
      <!-- BORDER -->
      <div class="relative w-full h-full flex flex-col justify-center gap-1.5 p-2 rounded-lg border"
           :class="{
             '': props.cardState !== 'validated',
             'border-transparent' : props.answerState === 'selected',
             'border-beige-medium' : props.answerState !== 'selected',
             'bg-green-light border-green-medium text-green-medium items-center': props.cardState === 'validated',
           }">
        <slot name="verso" v-if="props.cardState === 'hide'" class=""/>
        <slot name="recto" v-if="props.cardState === 'show'" class=""/>
        <div v-show="props.cardState === 'validated'">
          <Deco :class="{'w-[45%] ':props.mode === 'vertical', 'h-[45%] ': props.mode === 'horizontal'}"
                class="absolute aspect-square top-1 left-1 "/>
          <Deco :class="{'w-[45%] ':props.mode === 'vertical', 'h-[45%] ': props.mode === 'horizontal'}"
                class="absolute aspect-square top-1 right-1 -scale-x-100"/>
          <Deco :class="{'w-[45%] ':props.mode === 'vertical', 'h-[45%] ': props.mode === 'horizontal'}"
                class="absolute aspect-square bottom-1 left-1 -scale-y-100"/>
          <Deco :class="{'w-[45%] ':props.mode === 'vertical', 'h-[45%] ': props.mode === 'horizontal'}"
                class="absolute aspect-square bottom-1 right-1 -scale-100"/>
          <Check class="text-green aspect-square w-16"/>
        </div>
      </div>
    </div>
  </div>
</template>
