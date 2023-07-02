<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <Transition v-if="props.show" name="bgTransitionLeft1">
    <div class="absolute w-auto h-1/2 translate-x-[-55%] translate-y-[-30%] -scale-x-100">
      <img :src="'/images/illu-leaf-drop.png'" alt="" class="w-full h-full object-contain origin-top-left">
    </div>
  </Transition>
  <Transition v-if="props.show" name="bgTransitionLeft2">
    <div>
      <div class="absolute w-auto h-full left-0 bottom-0 translate-x-[-70%] translate-y-[60%]">
        <img :src="'/images/illu-carrot.png'" alt="" class="w-full h-full object-contain origin-bottom"/>
      </div>
      <div class="absolute w-auto h-full left-0 bottom-0 translate-x-[-80%] translate-y-[50%] rotate-[35deg]">
        <img :src="'/images/illu-carrot.png'" alt="" class="w-full h-full object-contain origin-bottom">
      </div>
    </div>
  </Transition>
  <Transition v-if="props.show" name="bgTransitionRight2">
    <div
        class="absolute max-w-2/3 h-auto right-0 bottom-0 translate-x-[35%] translate-y-[55%]">
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
.bgTransitionLeft2-leave-to {
  transform: scaleX(1.2) translate(-200px, 30px) rotate(-50deg);
  opacity: 0;
}

.bgTransitionRight1-enter-from,
.bgTransitionRight1-leave-to,
.bgTransitionRight2-enter-from,
.bgTransitionRight2-leave-to {
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

</style>