<template>
  <button class="round-button group relative rounded-full flex items-center justify-center m-0 p-0 bg-transparent border-0 " :class="`${size == 'md' ? 'w-20 h-20 round-button--md' : (size == 'sm' ? 'w-12 h-12 round-button--sm' : 'w-7 h-7 round-button--xs')}`" >
    <div class="round-button-bg absolute w-full h-full rounded-full outline outline-1  group-hover:outline-offset-[0px] group-hover:scale-75 transform" :class="`${classProperty} ${size == 'md' ? '-outline-offset-[7px]' : (size == 'sm' ? '-outline-offset-[5px]' : '-outline-offset-[4px]')}`" />
    <div class="round-button-icon z-10" :class="`${classProperty}`"><slot></slot></div>
  </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'RoundButtonComponent',
  props: {
    classProperty: {
      default: 'text-beige bg-secondary',
      type: String
    },
    size: {
      default: 'md', // md:80px sm:48px xs:28px
      type: String
    },
  },
  mounted() {
  },
  methods: {
  }
});
</script>

<style>
.round-button--md .round-button-icon > svg {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.round-button--sm .round-button-icon > svg {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.round-button--xs .round-button-icon > svg {
  width: 12px;
  height: 12px;
  object-fit: contain;
}

.round-button-bg {
  transition: transform 0.4s cubic-bezier(0.3, 2.0, 0.45, 1.0), outline-offset 0.2s ease-out;
}
</style>
