<template>
  <div>
    <button class="sticker-element w-full h-min bg-gray-300 rounded-full relative p-0 flex justify-center items-center" @click="onModify = true">
      <img v-if="sticker" :src="sticker" class="h-full w-full object-contain absolute">
      <p v-if="!sticker" class="absolute">sticker</p>
    </button>
    <div v-if="onModify" class="fixed z-40 w-screen h-screen bg-black/25 flex justify-center items-center top-0 left-0">
    <div class="bg-white p-8">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="index in numberStickers" :v-bind="index" class="w-48 h-48 flex justify-center items-center">
          <button @click="stickerSelected = {idSticker: index}" class="p-0 overflow-hidden rounded-full">
            <img :src="getStickerUrl({idSticker: index})" class="object-contain w-full h-full pointer-events-none">
          </button>
        </div>
      </div>
      <button @click="saveData">Valider</button>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../../common/DatabaseManager";

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
    }
  },
  data: () => {
    return {
      pb: DatabaseManagerInstance.pb,
      sticker: '',
      idRecord: null,
      onModify: false,
      stickerList: [],
      stickerSelected: null,
      numberStickers: 3
    }
  },
  mounted() {
    this.pb.collection('sticker').getFirstListItem('page="' + this.pageId + '" && slot=' + this.slotNumber + '').then(result => {
      this.idRecord = result.id
      this.sticker = this.getStickerUrl(result);
    }).catch(error => {
      console.error(error.message)
    })
  },
  methods: {
    getStickerUrl(data) {
      return './stickers/' + data.idSticker + '.svg'
    },
    async saveData() {
      const data = {
        "idSticker": this.stickerSelected.idSticker,
        "page": this.pageId,
        "slot": this.slotNumber
      };

      await this.pb.collection('sticker').create(data);

      if (this.idRecord) {
        await this.pb.collection('sticker').delete(this.idRecord);
      }

      this.idRecord = this.stickerSelected.id
      this.sticker = this.getStickerUrl(this.stickerSelected)
      this.onModify = false;
    }
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
