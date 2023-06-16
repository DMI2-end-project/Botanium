<template>
  <div class="w-screen h-screen relative">
    <div v-for="(particle, index) in particles" :key="index" ref="particule" class="particle absolute bg-beige blur-[2px] mix-blend-soft-light rounded-full opacity-0" :style="particleStyle(index)">
      <!-- Votre contenu de particule ici -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// interface Particules { x: number; y: number; size: number; delay: number }[]

export default defineComponent({
  data: () => {
    return {
      particles: []
    }
  },

  mounted() {
    // Génération des particules
    this.generateParticles();
  },

  methods: {
    generateParticles() {
      // Nombre de particules
      const numParticles = 50;

      for (let i = 0; i < numParticles; i++) {
        const particle = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: this.getRandomSize(),
          delay: this.getRandomDelay(),
        };

        this.particles.push(particle);
      }
    },

    getRandomSize() {
      // Générer une taille aléatoire pour les particules
      const minSize = 5;
      const maxSize = 15;
      return Math.random() * (maxSize - minSize) + minSize;
    },

    getRandomDelay() {
      // Générer un délai aléatoire pour chaque particule
      const minDelay = 0;
      const maxDelay = 2;
      return Math.random() * (maxDelay - minDelay) + minDelay;
    },

    particleStyle(index: number) {
      // Renvoie les styles CSS pour chaque particule en fonction de son index
      const particle = this.particles[index];

      this.$nextTick(() => {
        this.$refs.particule[index].style.setProperty('--time', `${Math.random() * 10 + 10}s`)
        this.$refs.particule[index].style.setProperty('--delay', `${particle.delay * 10}s`)
        this.$refs.particule[index].style.setProperty('--y', `${particle.delay}px`)
      })

      return {
        top: `${particle.y}px`,
        left: `${particle.x}px`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
      };
    }
  }
})
</script>

<style scoped>
.particle {
  animation: move var(--time) ease infinite var(--delay);
}

@keyframes move {
  0% {
    transform: translate(-50px, -10px);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translate(50px, 10px);
    opacity: 0;
  }
}
</style>
