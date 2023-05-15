<template>
  <button class="RoundButton group relative rounded-full flex items-center justify-center m-0 p-0 bg-transparent border-0 " :class="`${containerClass}`" >
    <div class="RoundButton__bg absolute w-full h-full rounded-full outline outline-1 group-hover:outline-offset-[0px] group-hover:scale-75 transform" :class="`${bgClass}`" />
    <div class="RoundButton__icon z-10" :class="`${textClass}`"><slot></slot></div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { COlOR, SIZE } from "../../common/Constants";

export default defineComponent({
  name: 'RoundButtonComponent',
  props: {
    color: {
      default: COlOR.PINK,
      type: String
    },
    size: {
      default: SIZE.MD, // md:80px sm:48px xs:28px
      type: String
    },
  },
  data() {
    return {
      containerClass: '',
      bgClass: '',
      textClass: '',
    }
  },
  mounted() {
    switch (this.color) {
      case COlOR.PINK:
        this.bgClass += ' bg-pink text-beige';
        this.textClass += ' text-beige';
        break;
      case COlOR.GREEN:
        this.bgClass += ' bg-green text-beige';
        this.textClass += ' text-beige';
        break;
      case COlOR.YELLOW:
        this.bgClass += ' bg-yellow text-beige';
        this.textClass += ' text-beige';
        break;
      case COlOR.GREEN_MEDIUM:
        this.containerClass += ' bg-green-medium text-green';
        this.textClass += ' text-green';
        break;
      default:
        break
    }

    switch (this.size) {
      case SIZE.XS:
        this.containerClass += ' w-7 h-7 RoundButton--xs';
        this.bgClass += ' -outline-offset-[4px]';
        break;
      case SIZE.SM:
        this.containerClass += ' w-12 h-12 RoundButton--sm';
        this.bgClass += ' -outline-offset-[5px]';
        break;
      case SIZE.MD:
        this.containerClass += ' w-20 h-20 RoundButton--md';
        this.bgClass += ' -outline-offset-[7px]';
        break;
      default:
        break
    }
  },
  methods: {
  }
});
</script>

<style>
.RoundButton--md .RoundButton__icon > svg {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.RoundButton--sm .RoundButton__icon > svg {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.RoundButton--xs .RoundButton__icon > svg {
  width: 12px;
  height: 12px;
  object-fit: contain;
}

.RoundButton__bg {
  transition: transform 0.4s cubic-bezier(0.3, 2.0, 0.45, 1.0), outline-offset 0.2s ease-out;
}
</style>
