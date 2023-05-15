<template>
  <div class="round-item relative rounded-full flex items-center justify-center m-0 p-0 border-0 " :class="`${classProperty} ${size == 'xl' ? 'w-52 h-52 round-item--xl' : (size == 'lg' ? 'w-32 h-32 round-item--lg' : (size == 'md' ? 'w-20 h-20 round-item--md' : 'w-14 h-14 round-item--sm'))}`" >
    <div class="round-item-icon"><slot></slot></div>
    <div v-if="isCkecked" class="absolute shadow-md text-beige w-8 h-8 bg-green rounded-full -right-2 -top-2 flex items-center justify-center">
      <Check />
    </div>
    <div v-if="isEnigma" class="enigma absolute text-beige w-[180%] h-[180%]">
      <Enigma class="w-full h-full object-contains" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Check from "./../../assets/svg/ico-check-simple.svg"
import Enigma from "./../../assets/svg/text-enigma.svg"

export default defineComponent({
  name: 'RoundItemComponent',
  components: {
    Check,
    Enigma
  },
  props: {
    classProperty: {
      default: 'text-beige bg-secondary',
      type: String
    },
    size: {
      default: 'md', // xl:208px lg:128px md:80 sm:56
      type: String
    },
    isCkecked: {
      default: false,
      type: Boolean
    },
    isEnigma: {
      default: false,
      type: Boolean
    }
  },
  mounted() {
  },
  methods: {
  }
});
</script>

<style>
.round-item--xl .round-item-icon > svg {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.round-item--lg .round-item-icon > svg {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.round-item--md .round-item-icon > svg {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.round-item--sm .round-item-icon > svg {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.round-item--xs .round-item-icon > svg {
  width: 12px;
  height: 12px;
  object-fit: contain;
}
</style>
