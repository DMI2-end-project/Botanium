<template>
  <div>
    <button class="sticker-element w-full h-min bg-gray-300 rounded-full relative p-0 flex justify-center items-center" @click="onModify = true">
      <img v-if="sticker" :src="sticker" class="h-full w-full object-contain absolute">
      <p v-if="!sticker" class="absolute">sticker</p>
    </button>
    <div v-if="onModify" class="fixed z-40 w-screen h-screen top-0 left-0 flex items-end">
      <div class="relative h-5/6 mt-auto w-fit flex items-center" :class="isPageLeft ? 'ml-auto' : 'mr-auto'">
        <button v-if="stickerSelected" @click="saveData" class="absolute z-10 h-24 w-24 rounded-full top-0 bottom-0 my-auto h-fit" :class="isPageLeft ? '-left-12' : '-right-12'">Valider</button>
        <div class="bg-white p-8 h-full" :class="isPageLeft ? '' : 'scroll-left'">
          <div class="overflow-y-scroll h-full">
            <p>Les autocollants du jardin</p>
            <div class="grid grid-cols-3 gap-8 mt-10 mx-8">
              <div v-for="index in numberStickers" :v-bind="index" class="w-32 h-32 flex justify-center items-center">
                <button @click="changeSticker(index % 3 + 1)" class="p-0 overflow-hidden rounded-full">
                  <img :src="getStickerUrl({idSticker: index % 3 + 1})" class="object-contain w-full h-full pointer-events-none">
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
  data: () => {
    return {
      pb: DatabaseManagerInstance.pb,
      sticker: '',
      idRecord: null,
      onModify: false,
      stickerList: [],
      stickerSelected: null,
      numberStickers: 3 * 10
    }
  },
  watch: {
    onModify(value) {
      this.$emit('onModify', value)
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
    changeSticker(index) {
      this.stickerSelected = { idSticker: index }
      this.sticker = this.getStickerUrl(this.stickerSelected)
    },
    async saveData() {
      const data = {
        "idSticker": this.stickerSelected.idSticker,
        "page": this.pageId,
        "slot": this.slotNumber
      };

      const newStickers = await this.pb.collection('sticker').create(data);

      console.log(this.idRecord)

      if (this.idRecord) {
        const toto = await this.pb.collection('sticker').delete(this.idRecord);
        console.log('delete', toto)
      }

      this.idRecord = newStickers.id
      this.sticker = this.getStickerUrl(this.stickerSelected)
      this.stickerSelected = null;
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

.scroll-left {
  direction:ltr;
}

.scroll-left > * {
  direction: rtl;
}

  /* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #4D6B36 #85A754;
}

/* Chrome, Edge and Safari */
*::-webkit-scrollbar {
  width: 8px;
  width: 8px;
  margin: 10px;
}
*::-webkit-scrollbar-track {
  border-radius: 20px;
  background-color: #85A754;
  border: 0 solid #FFFFFF;
}

*::-webkit-scrollbar-track:hover {
  background-color: #8FB45A;
}

*::-webkit-scrollbar-track:active {
  background-color: #8FB45A;
}

*::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #4D6B36;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: #57793D;
}

*::-webkit-scrollbar-thumb:active {
  background-color: #57793D;
}
</style>
