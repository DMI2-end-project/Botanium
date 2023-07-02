<template>
  <div class="w-screen h-screen relative -translate-y-full">
    <div class="dandelion-1 absolute mix-blend-soft-light opacity-80"><div><div><img src="/images/dandelion.png" class=""></div></div></div>
    <div class="dandelion-2 absolute mix-blend-soft-light opacity-80"><div><div><img src="/images/dandelion.png" class=""></div></div></div>
    <div class="dandelion-3 absolute mix-blend-soft-light opacity-80"><div><div><img src="/images/dandelion.png" class=""></div></div></div>
    <div class="dandelion-4 absolute mix-blend-soft-light opacity-80"><div><div><img src="/images/dandelion.png" class=""></div></div></div>
  </div>
</template>

<style scoped>

.dandelion-1 > div > div {
  animation: rotate 10s ease infinite;
  transform-origin: top;
}
.dandelion-1 {
  animation: move1 80s linear infinite;
}
.dandelion-1 > div {
  animation: translateImg 10s ease infinite;
}

.dandelion-2 > div > div {
  animation: rotate 7s ease infinite 30s;
  transform-origin: top;
}

.dandelion-2 {
  transform: translateX(-10vw);
  animation: move2 60s linear infinite 30s;
}

.dandelion-2 > div {
  animation: translateImg 7s ease infinite 30s;
}

.dandelion-3 > div > div {
  animation: rotate 6s ease infinite 20s;
  transform-origin: top;
}

.dandelion-3 {
  transform: translateX(-10vw);
  animation: move3 40s linear infinite 20s;
}

.dandelion-3 > div {
  animation: translateImg 6s ease infinite 20s;
}

.dandelion-4 > div > div {
  animation: rotate 5s ease infinite 0s;
  transform-origin: top;
}

.dandelion-4 {
  animation: move4 30s linear infinite 0s;
}

.dandelion-4 > div {
  animation: translateImg 5s ease infinite 0s;
}

.dandelion-1 > div > div:before, .dandelion-2 > div > div:before, .dandelion-3 > div > div:before, .dandelion-4 > div > div:before {
  content: '';
  position: absolute;
  background: #FEFBE9;
  opacity: 0.2;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  border-radius: 100%;
  filter: blur(30px);
}

@keyframes move1 {
  0% {
    transform: translateX(0vw) translateY(-10vh) scale(0.8);
  }
  100% {
    transform: translateX(30vw) translateY(110vh) scale(0.8);
  }
}

@keyframes move2 {
  0% {
    transform: translateX(30vw) translateY(-10vh) scale(0.6);
  }
  100% {
    transform: translateX(50vw) translateY(110vh) scale(0.6);
  }
}

@keyframes move3 {
  0% {
    transform: translateX(85vw) translateY(-10vh) scale(0.7);
  }
  100% {
    transform: translateX(105vw) translateY(110vh) scale(0.7);
  }
}

@keyframes move4 {
  0% {
    transform: translateX(70vw) translateY(-10vh) scale(0.5);
  }
  100% {
    transform: translateX(90vw) translateY(110vh) scale(0.5);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(50deg);
  }
  50% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(50deg);
  }
}

@keyframes translateImg {
  0% {
    transform: translateX(-15px);
  }
  50% {
    transform: translateX(15px);
  }
  100% {
    transform: translateX(-15px);
  }
}
</style>
