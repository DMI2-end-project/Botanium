<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  data() {
    return {
      show: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.show = true
    })
  },
});
</script>

<template>
  <Transition name="bgTransitionLeft1">
    <div v-if="show" class="absolute w-auto h-1/2 top-[-10%] -left-[10%] origin-bottom">
      <img :src="'/images/illu-leaf-drop.png'" alt="" class="w-full h-full object-contain origin-top-left translate-x-full -scale-x-100">
    </div>
  </Transition>
  <Transition name="bgTransitionLeft2">
    <div v-if="show" class="absolute w-auto h-full left-[-45vh] bottom-[-50vh]">
      <img :src="'/images/illu-carrot.png'" alt="" class="w-full h-full object-contain origin-bottom rotate-[-10deg]"/>
    </div>
  </Transition>
  <Transition name="bgTransitionLeft3">
    <div v-if="show" class="absolute w-auto h-full left-[-80vh] bottom-[-55vh]">
      <img :src="'/images/illu-carrot.png'" alt="" class="w-full h-full object-contain origin-bottom rotate-[15deg]">
    </div>
  </Transition>
  <Transition name="bgTransitionRight2">
    <div
      v-if="show"
        class="absolute max-w-[65vw] max-h-[100vh] h-auto -right-[25%] -bottom-[40%]">
      <img :src="'/images/illu-carrot.png'" alt="" class="object-contain origin-bottom">
    </div>
  </Transition>
</template>

<style scoped>
.organic-1 {
  animation: organic 18s ease infinite;
}

.organic-2 {
  animation: organic 15s ease infinite 0.2s;
}

.organic-3 {
  animation: organic 19s ease infinite 0.1s;
}

.organic-4 {
  animation: organic 20s ease infinite 0.4s;
}

.organic-5 {
  animation: organic 24s ease infinite 0.1s;
}

@keyframes organic {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(1.2deg);
  }
  50% {
    transform: rotate(-0.3deg);
  }
  75% {
    transform: rotate(0.5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.bgTransitionLeft1-enter-from,
.bgTransitionLeft1-leave-to,
.bgTransitionLeft2-enter-from,
.bgTransitionLeft2-leave-to,
.bgTransitionLeft3-enter-from,
.bgTransitionLeft3-leave-to {
  transform: scaleX(1.2) translate(-200px, 30px) rotate(-50deg);
  opacity: 0;
}

.bgTransitionRight1-enter-from,
.bgTransitionRight1-leave-to,
.bgTransitionRight2-enter-from,
.bgTransitionRight2-leave-to,
.bgTransitionRight3-enter-from,
.bgTransitionRight3-leave-to {
  transform: scaleX(1.2) translate(200px, 30px) rotate(50deg);
  opacity: 0;
}

.bgTransitionLeft1-enter-active,
.bgTransitionRight1-enter-active {
  transition: transform 1.2s cubic-bezier(0.445, 1.375, 0.305, 1.000),
  opacity 0.2s ease-out;
}

.bgTransitionLeft2-enter-active,
.bgTransitionRight2-enter-active {
  transition: transform 1.2s cubic-bezier(0.445, 1.375, 0.305, 1.000) 0.2s,
  opacity 0.2s ease-out 0.2s;
}

.bgTransitionLeft3-enter-active,
.bgTransitionRight3-enter-active {
  transition: transform 1.2s cubic-bezier(0.445, 1.375, 0.305, 1.000) 0.4s,
  opacity 0.2s ease-out 0.4s;
}

.bgTransitionLeft1-leave-active,
.bgTransitionRight1-leave-active {
  transition: transform 0.9s cubic-bezier(0.36, 0, 0.66, -0.56) 0.2s,
  opacity 0.2s ease-in 0.9s;
}

.bgTransitionLeft2-leave-active,
.bgTransitionRight2-leave-active {
  transition: transform 0.9s cubic-bezier(0.36, 0, 0.66, -0.56),
  opacity 0.2s ease-in 0.7s;
}

.bgTransitionLeft3-leave-active,
.bgTransitionRight3-leave-active {
  transition: transform 0.9s cubic-bezier(0.36, 0, 0.66, -0.56) 0.4s,
  opacity 0.2s ease-in 1.1s;
}

</style>
