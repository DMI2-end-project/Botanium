<template>
  <div>
    <canvas ref="canvasRef" width="400" height="300"></canvas>
    <button @click="togglePlayback">Lire la vidéo</button>
  </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  mounted() {
    this.video = document.createElement('video');
    this.video.src = '/src/assets/cursor-game-videos/ezgif.com-reverse.webm'; // Remplacez par le chemin de votre vidéo
    this.video.autoplay = true;
    this.video.loop = true;

    this.canvas = this.$refs.canvasRef;
    this.ctx = this.canvas.getContext('2d');

    this.video.addEventListener('play', () => {
      this.renderFrames();
    });

    this.video.addEventListener('pause', () => {
      cancelAnimationFrame(this.animationFrame);
    });
  },
  methods: {
    togglePlayback() {
      if (this.video.paused) {
        this.video.play();
      } else {
        this.video.pause();
      }
    },
    renderFrames() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const renderFrame = () => {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        if (this.video.currentTime > 2) {
          this.video.currentTime -= 0.05; // Réduire la valeur pour ajuster la vitesse de rembobinage
          this.animationFrame = requestAnimationFrame(renderFrame);
        } else {
          this.video.pause();
        }
      };

      renderFrame();
    }
  }
});
</script>
