<template>
  <div :class="(isBg ? 'RoundButtonBg bg-beige-medium p-8 rounded-full' : '') + (isActive ? '' : ' opacity-50 pointer-events-none')">
    <button
      class="RoundButton group relative aspect-square rounded-full flex items-center justify-center m-0 p-0 bg-transparent border-0 "
      :class="`${containerClass}`">
      <div
          class="RoundButton__bg absolute w-full h-full rounded-full outline outline-1 group-hover:outline-offset-[0px] group-hover:scale-75 transform"
          :class="`${bgClass}`"/>
      <div class="RoundButton__icon z-10" :class="`${textClass}`">
        <slot/>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { COLOR, SIZE } from "../../common/Constants";

export default defineComponent({
  name: 'RoundButton',
  props: {
    color: {
      default: COLOR.PINK,
      type: String
    },
    size: {
      default: SIZE.MD, // md:80px sm:48px xs:28px
      type: String
    },
    isBg: {
      default: false,
      type: Boolean
    },
    isActive: {
      default: true,
      type: Boolean
    }
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
      case COLOR.PINK:
        this.bgClass += ' bg-pink text-beige';
        this.textClass += ' text-beige';
        break;
      case COLOR.GREEN:
        this.bgClass += ' bg-green text-beige';
        this.textClass += ' text-beige';
        break;
      case COLOR.YELLOW:
        this.bgClass += ' bg-yellow text-beige';
        this.textClass += ' text-beige';
        break;
      case COLOR.GREEN_MEDIUM:
        this.bgClass += ' bg-green-medium text-green';
        this.textClass += ' text-green';
        break;
      case COLOR.GREEN_MEDIUM_BEIGE:
        this.bgClass += ' bg-green-medium text-beige';
        this.textClass += ' text-beige';
        break;
      case COLOR.GREEN_LIGHT:
        this.bgClass += ' bg-green-light text-green';
        this.textClass += ' text-green';
        break;
      case COLOR.RED:
        this.bgClass += ' bg-red text-beige';
        this.textClass += ' text-beige';
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
      case SIZE.LG:
        this.containerClass += ' w-32 h-32 RoundButton--lg';
        this.bgClass += ' -outline-offset-[10px]';
        break;
      default:
        break
    }
  },
  methods: {}
});
</script>

<style>
.RoundButton--lg .RoundButton__icon > svg {
  width: 88px;
  height: 88px;
  object-fit: contain;
}

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
