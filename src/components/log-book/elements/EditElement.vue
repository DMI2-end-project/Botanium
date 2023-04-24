<template>
  <button class="edit-element w-full p-0" ref="container" :class="classProperty + ' ' + (textData.id || drawData.id ? 'bg-transparent' : 'bg-gray-100')" @click="onModify = true">
    <p v-if="!textData.id && !drawData.id">edit</p>
    <div v-if="textData.id" class="flex flex-col justify-between h-full bg-gray-200 p-4 drop-shadow-lg">
      <p class="text-xs text-left">{{ textData.content }}</p>
      <p class="text-right mt-4">{{ textData.signature }}</p>
    </div>
    <div v-if="drawData.id" class="flex flex-col justify-between h-full relative">
      <div class="w-full h-full"><img :src="drawUrl" class="w-full h-full object-contain my-auto"></div>
      <p class="text-right mt-4 absolute bottom-0 right-0 bg-beige m-2">{{ drawData.signature }}</p>
    </div>
  </button>
  <div v-if="onModify" class="fixed z-40 w-screen h-screen bg-black/25 flex justify-center items-center top-0 left-0">
    <div v-if="!onSignature" class="bg-white h-[94%] w-full p-8 m-12">
      <div v-if="!onWrite && !onDraw" class="h-full w-full grid grid-cols-2 gap-8">
        <button @click="onWrite = true">Ecrire</button>
        <button @click="onDraw = true">Dessiner</button>
      </div>
      <div v-if="onWrite" class="w-full h-full p-12 flex flex-col items-end">
        <textarea v-model="textData.content" autofocus class="w-full h-full text-xl p-4">
        </textarea>
        <button @click="onSignature = true" class="mt-10">Valider</button>
      </div>
      <div v-if="onDraw" class="w-full h-full p-0 flex flex-col items-end">
        <Draw @save="saveDraw" :lastDrawUrl="drawUrl" :ratio="ratio" />
      </div>
    </div>
    <div v-if="onSignature" class="bg-white p-8 flex flex-col items-center">
      <p>Note le ou les prénoms des élèves qui ont vécu  ce souvenir au jardin :</p>
      <input type="text" v-model="signature" class="mt-5">
      <button v-if="signature != ''" @click="saveData" class="mt-5">Valider</button>
    </div>
  </div>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../../common/DatabaseManager";
import Draw from "./../Draw.vue"
import type { TextData, DrawData } from './../../../common/Interfaces'
import { base64ToFile } from './../../../common/Lib';

export default {
  name: "EditElementComponent",
  components: {
    Draw
  },
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
  },
  emits: ['onModify'],
  data: () => {
    return {
      onModify: false as Boolean,
      onWrite: false as Boolean,
      onDraw: false as Boolean,
      onSignature: false as Boolean,
      textData: {} as TextData,
      drawData: {} as DrawData,
      signature: '' as string,
      ratio: 1 as number,
    }
  },
  computed: {
    drawUrl():string {
      return DatabaseManagerInstance.getImageUrl(this.drawData)
    }
  },
  watch: {
    onModify(value:Boolean) {
      this.$emit('onModify', value)
    },
    signature(value: string) {
      this.textData.signature = this.drawData.signature = value;
    }
  },
  async mounted() {
    this.ratio = this.$refs.container.clientWidth / this.$refs.container.clientHeight;
    this.textData = await DatabaseManagerInstance.fetchText(this.pageId, this.slotNumber);
    this.drawData = await DatabaseManagerInstance.fetchDraw(this.pageId, this.slotNumber);
    this.signature = (this.textData.id ? this.textData.signature : this.drawData.signature);
    this.textData.slot = this.drawData.slot = this.slotNumber;
    this.textData.page = this.drawData.page = this.pageId;
  },
  methods: {
    async saveData() {
      if (this.onWrite) {
        if (this.textData.id === '') {
          this.textData = await DatabaseManagerInstance.createText(this.textData);
        } else {
          this.textData = await DatabaseManagerInstance.updateText(this.textData);
        }
        if (this.drawData.id != '') {
          await DatabaseManagerInstance.deleteDraw(this.drawData)
          this.drawData.id = ''
        }
      } else if (this.onDraw) {
        if (this.drawData.id === '') {
          this.drawData = await DatabaseManagerInstance.createDraw(this.drawData);
        } else {
          this.drawData = await DatabaseManagerInstance.updateDraw(this.drawData);
        }
        if (this.textData.id !== '') {
          await DatabaseManagerInstance.deleteText(this.textData)
          this.textData.id = ''
        }
      }

      this.onWrite = false;
      this.onDraw = false;
      this.onModify = false;
      this.onSignature = false;
    },
    saveDraw(data:string) {
      this.onSignature = true

      this.drawData.file = base64ToFile(data);
    }
  }
};
</script>

<style scoped>
</style>
