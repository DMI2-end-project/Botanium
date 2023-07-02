<template>
  <div class="w-screen h-screen relative -translate-y-full">
    <div class="dandelion-1 absolute mix-blend-soft-light opacity-80"><div><img src="/images/dandelion.png" class=""></div></div>
    <div class="dandelion-2 absolute mix-blend-soft-light opacity-80"><div><img src="/images/dandelion.png" class=""></div></div>
    <div class="dandelion-3 absolute mix-blend-soft-light opacity-80"><div><img src="/images/dandelion.png" class=""></div></div>
    <div class="dandelion-4 absolute mix-blend-soft-light opacity-80"><div><img src="/images/dandelion.png" class=""></div></div>
  </div>
</template>

<style scoped>

.dandelion-1 {
  animation: rotate1 100s ease infinite;
}
.dandelion-1 div {
  animation: move1 100s linear infinite;
}
.dandelion-1 img {
  animation: rotateImg1 100s ease-in-out infinite;
}

.dandelion-2 {
  animation: rotate2 80s ease infinite 30s;
}

.dandelion-2 div {
  transform: translateX(-10vw);
  animation: move2 80s linear infinite 30s;
}

.dandelion-2 img {
  animation: rotateImg2 80s ease infinite 30s;
}

.dandelion-3 {
  animation: rotate2 60s ease infinite 20s;
}

.dandelion-3 div {
  transform: translateX(-10vw);
  animation: move3 60s linear infinite 20s;
}

.dandelion-3 img {
  animation: rotateImg2 60s ease infinite 20s;
}

.dandelion-4 {
  animation: rotate1 120s ease infinite 0s;
}

.dandelion-4 div {
  transform: translateX(-10vw);
  animation: move4 120s linear infinite 0s;
}

.dandelion-4 img {
  animation: rotateImg1 120s ease infinite 0s;
}

.dandelion-1 div:before, .dandelion-2 div:before, .dandelion-3 div:before, .dandelion-4 div:before {
  content: '';
  position: absolute;
  background: #FEFBE9;
  opacity: 0.3;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  border-radius: 100%;
  filter: blur(30px);
}

@keyframes move1 {
  0% {
    transform: translateX(-10vw) translateY(10vh) scale(0.7);
  }
  100% {
    transform: translateX(100vw) translateY(110vh) scale(0.7);
  }
}

@keyframes move2 {
  0% {
    transform: translateX(-30vw) translateY(-30vh) scale(0.5);
  }
  100% {
    transform: translateX(110vw) translateY(50vh) scale(0.45);
  }
}

@keyframes move3 {
  0% {
    transform: translateX(-50vw) translateY(-10vh) scale(0.2);
  }
  100% {
    transform: translateX(80vw) translateY(100vh) scale(0.3);
  }
}

@keyframes move4 {
  0% {
    transform: translateX(-5vw) translateY(10vh) scale(0.3);
  }
  100% {
    transform: translateX(30vw) translateY(110vh) scale(0.45);
  }
}

@keyframes rotate1 {
  0% {
    transform: rotate(2deg);
  }
  10% {
    transform: rotate(10deg);
  }
  15% {
    transform: rotate(25deg);
  }
  25% {
    transform: rotate(12deg);
  }
  35% {
    transform: rotate(-9deg);
  }
  55% {
    transform: rotate(3deg);
  }
  70% {
    transform: rotate(-2deg);
  }
  85% {
    transform: rotate(4deg);
  }
  100% {
    transform: rotate(-4deg);
  }
}

@keyframes rotate2 {
  0% {
    transform: rotate(-2deg);
  }
  25% {
    transform: rotate(30deg);
  }
  25% {
    transform: rotate(20deg);
  }
  45% {
    transform: rotate(-3deg);
  }
  60% {
    transform: rotate(3deg);
  }
  75% {
    transform: rotate(6deg);
  }
  90% {
    transform: rotate(-2deg);
  }
  100% {
    transform: rotate(-2deg);
  }
}

@keyframes rotateImg1 {
  0% {
    transform: rotate(70deg);
  }
  10% {
    transform: rotate(20deg);
  }
  35% {
    transform: rotate(-20deg);
  }
  40% {
    transform: rotate(35deg);
  }
  50% {
    transform: rotate(25deg);
  }
  60% {
    transform: rotate(-105deg);
  }
  70% {
    transform: rotate(25deg);
  }
  100% {
    transform: rotate(-206deg);
  }
}

@keyframes rotateImg2 {
  0% {
    transform: rotate(-50deg);
  }
  13% {
    transform: rotate(0deg);
  }
  45% {
    transform: rotate(-400deg);
  }
  60% {
    transform: rotate(-300deg);
  }
  75% {
    transform: rotate(-400deg);
  }
  90% {
    transform: rotate(-300deg);
  }
  100% {
    transform: rotate(-600deg);
  }
}
</style>
