<template>
  <div>
    <button class="sticker-element w-full h-min bg-beige-medium/50 text-beige-dark rounded-full relative p-0 flex justify-center items-center outline outline-8 transition-all duration-400" :class="(onModify ? 'outline-yellow' : 'outline-transparent')" @click="onModify = true">
      <img v-if="stickerData.idSticker >= 0" :src="getStickerUrl(stickerData.idSticker)" class="h-full w-full rounded-full object-contain absolute shadow-md">
      <p v-if="!(stickerData.idSticker >= 0)" class="absolute">sticker</p>
    </button>
    <div v-if="onModify" class="fixed z-40 w-screen h-screen top-0 left-0 flex items-end">
      <div class="relative h-5/6 mt-auto w-fit flex items-center" :class="isPageLeft ? 'ml-auto' : 'mr-auto'">
        <button v-if="stickerData.idSticker !== stickerDataLast.idSticker" @click="saveData" class="absolute z-10 h-24 w-24 rounded-full top-0 bottom-0 my-auto h-fit" :class="isPageLeft ? '-left-12' : '-right-12'">Valider</button>
        <div class="bg-beige p-8 h-full" :class="isPageLeft ? '' : 'scroll-left'">
          <div class="overflow-y-scroll h-full">
            <p>Les autocollants du jardin</p>
            <div class="grid grid-cols-3 gap-8 mt-10 mx-8">
              <div v-for="index in numberStickers" :v-bind="index" class="w-32 h-32 flex justify-center items-center">
                <button @click="changeSticker(index % 3 + 1)" class="p-0 overflow-hidden rounded-full shadow-md">
                  <img :src="getStickerUrl(index % 3 + 1)" class="object-contain w-full h-full pointer-events-none">
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../../common/DatabaseManager";
import type { StickerData } from './../../../common/Interfaces'

export default {
  name: "StickerElementComponent",
  props: {
    pageId: {
      type: String,
      default: null
    },
    slotNumber: {
      type: Number,
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
      stickerData: {} as StickerData,
      stickerDataLast: {} as StickerData,
      onModify: false as boolean,
      stickers: [] as Array<StickerData>,
      stickerSelected: {} as StickerData,
      numberStickers: 3 * 10 as number
    }
  },
  watch: {
    onModify(value:boolean) {
      this.$emit('onModify', value)
    }
  },
  async mounted() {
    this.stickerData = await DatabaseManagerInstance.fetchSticker(this.pageId, this.slotNumber)
    this.stickerData.slot = this.slotNumber
    this.stickerData.page = this.pageId
    this.stickerDataLast = Object.assign({}, this.stickerData)
  },
  methods: {
    getStickerUrl(idSticker:number):string {
      return './stickers/' + idSticker + '.svg'
    },
    changeSticker(index: number) {
      this.stickerData.idSticker = index;
    },
    async saveData() {
      if (this.stickerDataLast.id) {
        await DatabaseManagerInstance.deleteSticker(this.stickerDataLast);
      }
      this.stickerData = await DatabaseManagerInstance.createSticker(this.stickerData);
      this.stickerDataLast = Object.assign({}, this.stickerData)

      this.onModify = false;
    },
  }
};
</script>

<style scoped>
.sticker-element::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
</style>
