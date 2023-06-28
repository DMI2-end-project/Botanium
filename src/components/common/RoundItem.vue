<template>
  <div class="RoundItem relative aspect-square rounded-full flex items-center justify-center m-0 p-0 border-0 "
       :class="`${containerClass} ${isEnigma ? '' : ''}`">
    <div class="RoundItem__icon" :class="`${textClass}`">
      <slot></slot>
    </div>
    <div v-if="isEnigma" class="enigma absolute w-[180%] h-[180%] text-beige">
      <Enigma class="w-full h-full object-contains"/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {COLOR, SIZE} from "./../../common/Constants"
import Enigma from "./../../assets/svg/text-enigma.svg?component"

export default defineComponent({
  name: 'RoundItemComponent',
  components: {
    Enigma
  },
  props: {
    color: {
      default: COLOR.PINK,
      type: String
    },
    size: {
      default: SIZE.MD, // xl:208px lg:128px md:80 sm:56
      type: String
    },
    isEnigma: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      containerClass: '',
      textClass: '',
    }
  },
  mounted() {
    switch (this.color) {
      case COLOR.WHITE:
        this.containerClass += ' bg-white text-green';
        this.textClass += ' text-green';
        break;
      case COLOR.PINK:
        this.containerClass += ' bg-pink text-beige';
        this.textClass += ' text-beige';
        break;
      case COLOR.GREEN:
        this.containerClass += ' bg-green text-beige';
        this.textClass += ' text-beige';
        break;
      case COLOR.YELLOW:
        this.containerClass += ' bg-yellow text-beige';
        this.textClass += ' text-beige';
        break;
      case COLOR.GREEN_MEDIUM:
        this.containerClass += ' bg-green-medium text-beige';
        this.textClass += ' text-beige';
        break;
      default:
        break
    }

    switch (this.size) {
      case SIZE.SM:
        this.containerClass += ' w-14 aspect-square RoundItem--sm';
        break;
      case SIZE.MD:
        this.containerClass += ' w-20 aspect-square RoundItem--md';
        break;
      case SIZE.LG:
        this.containerClass += ' w-32 aspect-square RoundItem--lg';
        break;
      case SIZE.XL:
        this.containerClass += ' w-52 aspect-square RoundItem--xl';
        break;
      default:
        break
    }
  },
  methods: {}
});
</script>

<style>
.RoundItem--xl .RoundItem__icon > svg {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.RoundItem--lg .RoundItem__icon > svg {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.RoundItem--md .RoundItem__icon > svg {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.RoundItem--sm .RoundItem__icon > svg {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.RoundItem--xs .RoundItem__icon > svg {
  width: 12px;
  height: 12px;
  object-fit: contain;
}
</style>
