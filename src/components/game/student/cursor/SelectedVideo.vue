<template>
  <div class="fixed w-full mt-20">
    <!-- <canvas ref="canvasRef" width="400" height="300"></canvas> -->
    <video ref="videoRef" muted class="video w-2/3 mt-10 mx-auto fixed" :class="isReverse ? 'opacity-0' : 'opacity-100'">
      <source src="./../../../../assets/cursor-game-videos/animation_hauteur.webm" type="video/webm">
    </video>
    <video ref="videoRefReverse" muted class="video-r w-2/3 mt-10 mx-auto fixed" :class="!isReverse ? 'opacity-0' : 'opacity-100'">
      <source src="./../../../../assets/cursor-game-videos/animation_hauteur_reverse.webm" type="video/webm">
    </video>
    <input type="range" @mousedown="onClick" @mouseup="onUnClick" v-model="selectedValue.current" min="0" max="5" step="0.001" class="w-2/3" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createRouter } from 'vue-router';

export default defineComponent({
  data() {
    return {
      selectedValue: {
        current: 0,
        target: 0
      },
      targetTimeVideo: 0,
      video: null,
      videoReverse: null,
      raf: 0,
      isReverse: false,
      isClicked: false,
    }
  },
  watch: {
    "selectedValue.target": {
      handler() {
        const newReverse = this.selectedValue.current > this.selectedValue.target ? true : false
        if (newReverse) {
          this.video.currentTime = this.targetTimeVideo
          this.videoReverse.play()
        } else {
          this.videoReverse.currentTime = this.video.duration - this.targetTimeVideo
          this.video.play()
        }

        this.isReverse = newReverse
      },
    }
  },
  mounted() {
    this.video = document.querySelector('.video')
    this.videoReverse = document.querySelector('.video-r')
    setTimeout(() => {
      this.update();
      this.video.playbackRate = 0
      this.videoReverse.playbackRate = 0
    }, 1000);
  },
  methods: {
    onClick() {
      this.isClicked = false
    },
    onUnClick() {
      this.isClicked = false
    },
    update() {
      this.selectedValue.target = Math.round(this.selectedValue.current)
      this.selectedValue.current = this.lerp(this.selectedValue.current, this.selectedValue.target, 0.05)
      this.targetTimeVideo = this.getMapVideo(this.selectedValue.target)

      if (this.video.currentTime > this.targetTimeVideo - 0.01 && this.video.currentTime < this.targetTimeVideo + 0.01) {
        this.video.pause()
      }

      if (this.video.duration - this.videoReverse.currentTime > this.targetTimeVideo - 0.01 && this.video.duration - this.videoReverse.currentTime < this.targetTimeVideo + 0.01) {
        this.videoReverse.pause()
      }

      this.video.playbackRate = Math.abs(this.video.currentTime - this.targetTimeVideo).toFixed(1) * 3
      this.videoReverse.playbackRate = Math.abs(this.video.duration - this.videoReverse.currentTime - this.targetTimeVideo).toFixed(1) * 3

      this.raf = requestAnimationFrame(this.update)
    },
    getMapVideo(n: number) {
      return (n / 5) * (this.video.duration - 0.02)
    },
    lerp(start:number, end:number, t:number):number {
      return start * (1 - t) + end * t;
    },
  },
  beforeUnmount() {
    cancelAnimationFrame(this.raf)
  }
})
</script>
