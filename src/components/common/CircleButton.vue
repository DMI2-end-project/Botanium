<template>
  <button class="font-bold flex items-center rounded-full p-2 group transition" :class="containerClass">
      <div class="rounded-full border aspect-square p-2 flex flex-col items-center justify-center transition" :class="circleClass"><slot /></div>
      <p class="px-3" :class="textClass">{{ text }}</p>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { COLOR, SIZE } from "../../common/Constants";

export default defineComponent({
  name: 'CircleButton',
  props: {
    text: String,
    color: {
      default: COLOR.GREEN,
      type: String
    },
    size: {
      default: SIZE.SM,
      type: String
    },
    colorReverse: {
      default: false,
      type: Boolean
    },
  },
  computed: {
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE // sm md
    },
  },
  data() {
    return {
      containerClass: '',
      circleClass: '',
      textClass: '',
    }
  },
  mounted() {
    switch (this.color) {
      case COLOR.GREEN:
        if (this.colorReverse) {
          this.containerClass += ' text-beige bg-green hover:bg-beige hover:text-green';
          this.circleClass += ' border-beige group-hover:border-green';
        } else {
          this.containerClass += ' text-green bg-beige hover:bg-green hover:text-beige';
          this.circleClass += ' border-green group-hover:border-beige';
        }
        break;
      case COLOR.PURPLE:
        if (this.colorReverse) {
          this.containerClass += ' text-beige bg-purple hover:bg-beige hover:text-purple';
          this.circleClass += ' border-beige group-hover:border-purple';
        } else {
          this.containerClass += ' text-purple bg-beige hover:bg-purple hover:text-beige';
          this.circleClass += ' border-purple group-hover:border-beige';
        }
        break;
      default:
        break
    }

    switch (this.size) {
      case SIZE.SM:
        this.textClass += ' text-sm';
        this.circleClass += ' w-10 h-10';
        break;
      case SIZE.MD:
        this.textClass += ' text-lg';
        this.circleClass += ' w-16 h-16';
        break;
      default:
        break
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
