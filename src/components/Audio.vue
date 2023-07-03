<script setup lang="ts">
import {onMounted, ref} from 'vue';
import RoundItem from "./common/RoundItem.vue";
import RoundButton from "./common/RoundButton.vue";
import {COLOR, SIZE} from "../common/Constants";

import Speaker from "../assets/svg/ico-speaker.svg?component";

const props = defineProps({
  audioPath: {
    type: String,
    required: true
  }
});

const audio = new Audio(props.audioPath);
audio.volume = 0.6;
//audio.volume = // entre 0 et 1
const isPlaying = ref(false);

const toggleAudio = () => {
  if (isPlaying.value) {
    audio.pause();
    audio.currentTime = 0;
  } else {
    audio.play();
  }
  isPlaying.value = !isPlaying.value;
};

onMounted(() => {
  audio.addEventListener('ended', () => {
    isPlaying.value = false;
  });
});
</script>

<template>
  <div class="rounded-full border-2" :class="isPlaying ? 'border-blue' : 'border-transparent'">
    <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" :size="SIZE.SM" @click="toggleAudio">
      <Speaker/>
    </RoundButton>
  </div>
</template>