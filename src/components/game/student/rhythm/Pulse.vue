<template>
  <div class="flex justify-center items-center relative">
    <div :class="pulse ? 'animate-pulse' : ''" class="animate-circle rounded-full">
      <div class="h-60 w-60 rounded-full bg-purple"></div>
    </div>
    <p :class="pulse ? 'animate-text-pulse' : ''" class=" animate-text absolute text-white text-xl">
      Clap !
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "PulseElement",
  data() {
    return {
      pulse: false,
    };
  },
  methods: {
    resetAnimation() {
      this.pulse = false;
      setTimeout(() => {
        this.pulse = true;
      }, 1);
    },
  }
});
</script>

<style>
@keyframes pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 30px rgba(255, 255, 255, 0);
  }

  /* 30% {
    box-shadow: 0 0 0 40px rgba(255, 255, 255, 0);
  } */

  49% {
    transform: scale(1);
    box-shadow: 0 0 0 0px rgba(255, 255, 255, 0);
  }

  50% {
    transform: scale(1.3);
    box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.5);
  }

  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 80px rgba(255, 255, 255, 0);
  }
}

.animate-pulse {
  animation: pulse 2000ms infinite;
}

.animate-circle {
  transform: scale(0.9);
  box-shadow: 0 0 0 30px rgba(255, 255, 255, 0);
}

@keyframes text-pulse {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }

  45% {
    transform: scale(1);
    opacity: 0;
  }

  50% {
    transform: scale(1);
    opacity: 1;
  }

  55% {
    opacity: 1;
  }

  100% {
    transform: scale(0.9);
    opacity: 0;
  }
}

.animate-text {
  transform: scale(0.9);
  opacity: 0;
}

.animate-text-pulse {
  animation: text-pulse 2000ms infinite;
}
</style>
