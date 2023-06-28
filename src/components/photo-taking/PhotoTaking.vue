<template>
  <div>
    <video ref="video" autoplay class="w-screen h-screen object-contain fixed top-0"></video>

    <div class="fixed bottom-8 px-4 w-full flex justify-between items-center">
      <div class="w-24 h-24 flex justify-left items-center">
        <RoundButton v-show="isMultipleCamera" @click="switchCamera" :color="COLOR.YELLOW" :size="SIZE.SM"><Reverse /></RoundButton>
      </div>
      <RoundButton @click="takePhoto" :color="COLOR.YELLOW"><Photo /></RoundButton>
      <div class="w-24 h-24">
        <button v-show="photos.length > 0" @click="isPhotosOpen = true" class="w-24 h-24 rounded-lg border-2 border-white p-0 overflow-hidden">
        <img :src="photos[photos.length - 1]" class="w-full h-full object-cover">
      </button>
      </div>
    </div>

    <div ref="flash" class="fixed inset-0 bg-white opacity-0 pointer-events-none"></div>

    <div v-if="isPhotosOpen && photos.length > 0" ref="images" class="fixed inset-0 h-screen w-screen bg-white gap-6 p-12 overflow-y-scroll">
      <div class="fixed right-0 top-0 m-8"><RoundButton @click="isPhotosOpen = false" :color="COLOR.RED"><Cross /></RoundButton></div>
      <div class="flex flex-wrap">
        <img v-for="photo in photos" :src="photo" class="w-64 h-64 p-2 object-contain rounded-lg">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../common/DatabaseManager";
import { useMainStore } from '../../stores/mainStore';
import { PhotoData } from "../../common/Interfaces";
import RoundButton from "../../components/common/RoundButton.vue";
import { base64ToFile } from './../../common/Lib';
import Photo from "./../../assets/svg/ico-photo.svg?component";
import Cross from "./../../assets/svg/ico-cross.svg?component";
import Reverse from "./../../assets/svg/ico-reverse.svg?component";
import { COLOR, SIZE } from "./../../common/Constants";

export default {
  components: { RoundButton, Photo, Cross, Reverse },
  data() {
    return {
      mainStore: useMainStore(),
      stream: null as MediaStream | null,
      video: null as HTMLVideoElement | null,
      photoData: {} as PhotoData,
      photos: [] as string[],
      isPhotosOpen: false,
      currentCamera: 'environment',
      isMultipleCamera: false
    };
  },
  computed: {
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    }
  },
  async mounted() {
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Find the available video devices
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    if (videoDevices.length > 1) {
      this.isMultipleCamera = true
    }

    this.setupCamera()

    window.addEventListener("blur", this.destoryCamera);
    window.addEventListener("focus", this.setupCamera);
    window.addEventListener("orientationchange", this.changeOrientation);
  },
  unmounted() {
    this.destoryCamera()
    window.removeEventListener("blur", this.destoryCamera);
    window.removeEventListener("focus", this.setupCamera);
    window.removeEventListener("orientationchange", this.changeOrientation);
  },
  methods: {
    changeOrientation() {
      this.destoryCamera()
      this.setupCamera()
    },
    destoryCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.stream = null
    },
    setupCamera() {
      this.video = this.$refs.video as HTMLVideoElement;

      if (!this.video) { return }
      if (this.stream) { return }

      navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight },
          facingMode: this.currentCamera
        },
      })
        .then(stream => {
          if (!this.video) { return }
          this.stream = stream;
          this.video.srcObject = stream;
        })
        .catch(error => {
          console.error('Erreur lors de l\'accès à la caméra :', error);
        });
    },
    async switchCamera() {
      this.currentCamera = this.currentCamera === 'environment' ? 'user' : 'environment';
      await this.setupCamera();
    },
    async takePhoto() {
      if (!this.video) { return }
      (this.$refs.flash as HTMLElement).classList.add('flash')
      setTimeout(() => {
        (this.$refs.flash as HTMLElement).classList.remove('flash')
      }, 600)

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) { return }

      const maxSize = 800;
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      let width = canvas.width
      let height = canvas.height

      if (canvas.width > maxSize || canvas.height > maxSize) {
        if (canvas.width > canvas.height) {
          canvas.width = maxSize;
          canvas.height = Math.floor((height / width) * maxSize);
        } else {
          canvas.height = maxSize;
          canvas.width = Math.floor((height / width) * maxSize);
        }
      }

      context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);

      if (this.mainStore.roomId) {
        this.photoData.classroom = this.mainStore.roomId;
        this.photoData.file = base64ToFile(photoDataUrl);
        const data = await DatabaseManagerInstance.createPhoto(this.photoData)
        this.photos.push(DatabaseManagerInstance.getImageUrl(data))
      }
    },
  },
};
</script>

<style scoped>
@keyframes flashAnimation {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.flash {
  animation: flashAnimation 0.4s forwards;
}
</style>
