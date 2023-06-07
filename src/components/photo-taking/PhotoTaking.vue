<template>
  <div>
    <video ref="video" autoplay class="w-screen h-screen object-contain fixed top-0"></video>
    <div class="fixed bottom-16 w-full flex justify-center"><RoundButton @click="takePhoto" :color="COLOR.YELLOW"><Camera /></RoundButton></div>

    <button v-if="photos.length > 0" @click="isPhotosOpen = true" class="fixed right-8 bottom-16 w-24 h-24 rounded-lg border-2 border-white p-0 overflow-hidden">
      <img :src="photos[photos.length - 1]" class="w-full h-full object-cover">
    </button>
    <div v-if="isPhotosOpen && photos.length > 0" ref="images" class="fixed inset-0 h-screen w-screen bg-white flex flex-wrap gap-6 p-12">
      <div class="fixed right-0 top-0 m-8"><RoundButton @click="isPhotosOpen = false" :color="COLOR.RED"><Cross /></RoundButton></div>
      <img v-for="photo in photos" :src="photo" class="w-64 h-64 object-contain rounded-lg">
    </div>
  </div>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../common/DatabaseManager";
import { useMainStore } from '../../stores/mainStore';
import { PhotoData } from "../../common/Interfaces";
import RoundButton from "../../components/common/RoundButton.vue";
import { base64ToFile } from './../../common/Lib';
import Camera from "./../../assets/svg/ico-camera.svg?component";
import Cross from "./../../assets/svg/ico-cross.svg?component";
import { COLOR } from "./../../common/Constants";

export default {
  components: { RoundButton, Camera, Cross },
  data() {
    return {
      mainStore: useMainStore(),
      stream: null,
      video: null,
      photoData: {} as PhotoData,
      photos: [] as string[],
      isPhotosOpen: false,
    };
  },
  computed: {
    COLOR() {
      return COLOR
    }
  },
  mounted() {
    this.video = this.$refs.video;

    navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 },
      },
    })
      .then(stream => {
        this.stream = stream;
        this.video.srcObject = stream;
      })
      .catch(error => {
        console.error('Erreur lors de l\'accès à la caméra :', error);
      });
  },
  methods: {
    async takePhoto() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;

      context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      const photoDataUrl = canvas.toDataURL('image/jpeg');

      this.photoData.classroom = this.mainStore.roomId;
      this.photoData.file = base64ToFile(photoDataUrl);
      const data = await DatabaseManagerInstance.createPhoto(this.photoData)
      this.photos.push(DatabaseManagerInstance.getImageUrl(data))
    },
  },
  beforeDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  },
};
</script>
