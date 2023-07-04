<template>
  <Transition :name="'round-button-' + number">
    <div v-if="colorBg && onMounted"
         @click="AudioManagerInstance().play(AUDIO.BUTTON, 0.3)"
         :class=" (isActive ? '' : ' opacity-50 pointer-events-none ') + containerBgClass"
         class="RoundButtonBg p-8 rounded-full  ">
      <button
          class="RoundButton group relative aspect-square rounded-full flex items-center justify-center m-0 p-0 bg-transparent border-0 "
          :class="`${containerClass}`">
        <div
            class="RoundButton__bg absolute w-full h-full rounded-full group-hover:scale-75 transform"
            :class="`${bgClass}`">
          <div
              class="RoundButton__border absolute w-full h-full rounded-full bg-transparent border scale-[0.85] group-hover:scale-100 transform"
              :class="`${borderClass}`"/>
        </div>
        <div class="RoundButton__icon z-10" :class="`${textClass}`">
          <slot/>
        </div>
      </button>
      <slot name="animation"/>
    </div>
    <button v-else-if="onMounted"
            @click="AudioManagerInstance().play(AUDIO.BUTTON, 0.3)"
            class="RoundButton group relative aspect-square rounded-full flex items-center justify-center m-0 p-0 bg-transparent border-0"
            :class="`${containerClass}` + (isActive ? '' : ' opacity-50 pointer-events-none')">
      <div
          class="RoundButton__bg absolute w-full h-full rounded-full group-hover:scale-75 transform"
          :class="`${bgClass}`">
        <div
            class="RoundButton__border absolute w-full h-full rounded-full bg-transparent border scale-[0.85] group-hover:scale-100 transform"
            :class="`${borderClass}`"/>
      </div>

      <div class="RoundButton__icon z-10" :class="`${textClass}`">
        <slot/>
      </div>
      <slot name="animation"/>
    </button>
  </Transition>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {AUDIO, COLOR, SIZE} from "../../common/Constants";
import {AudioManagerInstance} from "../../common/AudioManager";

export default defineComponent({
  name: 'RoundButton',
  computed: {
    AUDIO() {
      return AUDIO
    }
  },
  methods: {
    AudioManagerInstance() {
      return AudioManagerInstance
    }
  },
  props: {
    color: {
      default: COLOR.PINK,
      type: String
    },
    size: {
      default: SIZE.MD, // md:80px sm:48px xs:28px
      type: String
    },
    colorBg: {
      default: null,
      type: String
    },
    isActive: {
      default: true,
      type: Boolean
    },
    number: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      containerBgClass: '',
      containerClass: '',
      bgClass: '',
      textClass: '',
      borderClass: '',
      onMounted: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.onMounted = true
    }, 10)
    switch (this.color) {
      case COLOR.BLUE:
        this.bgClass += ' bg-blue text-beige';
        this.textClass += ' text-beige';
        this.borderClass += ' border-beige';
        break;
      case COLOR.PINK:
        this.bgClass += ' bg-pink text-beige';
        this.textClass += ' text-beige';
        this.borderClass += ' border-beige';
        break;
      case COLOR.GREEN:
        this.bgClass += ' bg-green text-beige';
        this.textClass += ' text-beige';
        this.borderClass += ' border-beige';
        break;
      case COLOR.YELLOW:
        this.bgClass += ' bg-yellow text-beige';
        this.textClass += ' text-beige';
        this.borderClass += ' border-beige';
        break;
      case COLOR.GREEN_MEDIUM:
        this.bgClass += ' bg-green-medium text-green';
        this.textClass += ' text-green';
        this.borderClass += ' border-green';
        break;
      case COLOR.GREEN_MEDIUM_BEIGE:
        this.bgClass += ' bg-green-medium text-beige';
        this.textClass += ' text-beige';
        this.borderClass += ' border-beige';
        break;
      case COLOR.GREEN_LIGHT:
        this.bgClass += ' bg-green-light text-green';
        this.textClass += ' text-green';
        this.borderClass += ' border-green';
        break;
      case COLOR.RED:
        this.bgClass += ' bg-red text-beige';
        this.textClass += ' text-beige';
        this.borderClass += ' border-beige';
        break;
      case COLOR.PURPLE:
        this.bgClass += ' bg-purple text-beige';
        this.textClass += ' text-beige';
        this.borderClass += ' border-beige';
        break;
      case COLOR.BEIGE:
        this.bgClass += ' bg-beige text-green';
        this.textClass += ' text-green';
        this.borderClass += ' border-green';
        break;
      default:
        break
    }

    switch (this.size) {
      case SIZE.XS:
        this.containerClass += ' w-10 h-10 RoundButton--xs';
        break;
      case SIZE.SM:
        this.containerClass += ' w-12 h-12 RoundButton--sm';
        break;
      case SIZE.MD:
        this.containerClass += ' w-20 h-20 RoundButton--md';
        break;
      case SIZE.LG:
        this.containerClass += ' w-32 h-32 RoundButton--lg';
        break;
      default:
        break
    }

    switch (this.colorBg) {
      case COLOR.BEIGE_MEDIUM:
        this.containerBgClass += ' bg-beige-medium';
        break;
      case COLOR.BEIGE:
        this.containerBgClass += ' bg-beige';
        break;
      default:
        break
    }
  },
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
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.RoundButton__bg {
  transition: transform 0.4s cubic-bezier(0.3, 2.0, 0.45, 1.0);
}

.RoundButton__border {
  transition: transform 0.2s ease-out;
}
</style>
