<template>
  <button class="image-element h-full p-0 text-beige-dark outline outline-8 transition-all duration-400" :class="classProperty + ' ' + (photoData.id ? 'bg-transparent' : 'bg-beige-medium/50') + ' ' + (onModify ? 'outline-yellow' : 'outline-transparent')" @click="modify">
    <div v-if="photoData.id" class="relative flex justify-center max-w-full max-h-full" :style="'transform: rotate(' + rotate + 'deg)'">
      <div :class="color" class="w-16 h-4 opacity-70 absolute -top-2 z-10"></div>
      <img alt="" :src="photoUrl(photoData)" class="image max-h-full max-w-full object-contain bg-white border-4 border-white drop-shadow-lg">
    </div>
    <p v-if="!photoData.id">image</p>
  </button>
  <div v-if="onModify" class="fixed z-40 w-screen h-screen top-0 left-0 flex items-end">
      <div class="relative h-5/6 mt-auto w-fit flex items-center" :class="isPageLeft ? 'ml-auto' : 'mr-auto'">
        <button v-if="photoDataLast != photoData" @click="saveData" class="absolute z-10 h-24 w-24 top-0 bottom-0 my-auto h-fit rounded-full" :class="isPageLeft ? '-left-12' : '-right-12'">Valider</button>
        <div class="bg-beige p-8 h-full" :class="isPageLeft ? '' : 'scroll-left'">
          <div class="overflow-y-scroll h-full">
            <div class="grid grid-cols-3 gap-8 mt-10 mx-8">
              <div v-for="photo in photos" :v-bind="photo" class="w-48 h-48 flex justify-center items-center">
                <button @click="changeImage(photo)" class="p-0 overflow-hidden">
                  <img alt="" :src="photoUrl(photo)" class="object-contain w-full h-full pointer-events-none">
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../../common/DatabaseManager";
import type { PhotoData } from './../../../common/Interfaces'
import { useMainStore } from '../../../stores/mainStore';

export default {
  name: "ImageElementComponent",
  props: {
    pageId: {
      type: String,
      default: null
    },
    slotNumber: {
      type: Number,
      default: null
    },
    classProperty: {
      type: String,
      default: null
    },
    isPageLeft: {
      type: Boolean,
      default: false
    }
  },
  emits: ['onModify'],
  data: () => {
    return {
      mainStore: useMainStore(),
      photoData: {} as PhotoData,
      photoDataLast: {} as PhotoData,
      onModify: false as Boolean,
      photos: [] as Array<PhotoData>,
      rotate: 0 as number,
      colors: ['bg-purple', 'bg-pink', 'bg-yellow'] as string[],
      color: '' as string,
    }
  },
  async mounted() {
    this.photoData = await DatabaseManagerInstance.fetchPhoto(this.pageId, this.slotNumber);
    this.photoDataLast = this.photoData
    this.updateRotate()
    this.updateColor()
  },
  watch: {
    onModify(value) {
      this.$emit('onModify', value)
    }
  },
  methods: {
    photoUrl(data: PhotoData):string {
      return DatabaseManagerInstance.getImageUrl(data)
    },
    async modify() {
      this.onModify = true
      this.photos = await DatabaseManagerInstance.fetchPhotos('page="" && classroom="' + this.mainStore.roomId + '"')
    },
    changeImage(photo: PhotoData) {
      this.photoData = photo
      this.updateRotate()
      this.updateColor()
    },
    updateRotate() {
      this.rotate = (Math.random() - 0.5) * 10;
    },
    updateColor() {
      this.color = this.colors[Math.floor(Math.random()*this.colors.length)]
    },
    async saveData() {
      if (this.photoDataLast.id !== '') {
        this.photoDataLast.page = '';
        this.photoDataLast.slot = 0;
        await DatabaseManagerInstance.updatePhoto(this.photoDataLast)
      }

      this.photoData.page = this.pageId;
      this.photoData.slot = this.slotNumber;
      this.photoData = await DatabaseManagerInstance.updatePhoto(this.photoData)
      this.photoDataLast = this.photoData

      this.onModify = false
    }
  }
};
</script>

<style scoped>

</style>
