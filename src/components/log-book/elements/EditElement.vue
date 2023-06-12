<template>
  <button class="edit-element w-full p-0 text-beige-dark outline outline-8 transition-all duration-400" ref="container" :class="classProperty + ' ' + (textData.id || drawData.id ? 'bg-transparent' : 'bg-beige-medium/50') + ' ' + (onModify ? 'outline-yellow' : 'outline-transparent')" @click="modify">
    <PenIcon v-if="!textData.id && !drawData.id" class="w-1/3 mx-auto object-contain" :class="onModify ? 'text-yellow' : ''" />
    <div v-if="textData.id" class="flex flex-col justify-between h-full bg-green-light p-4 drop-shadow-lg">
      <p class="text-sm text-left text-green font-semibold">{{ textData.content }}</p>
      <p class="text-right mt-4 font-hand-written text-xs text-green">{{ textData.signature }}</p>
    </div>
    <div v-if="drawData.id" class="flex flex-col justify-between h-full relative">
      <div class="w-full h-full"><img alt="" :src="drawUrl" class="w-full h-full object-contain my-auto"></div>
      <p class="text-right font-hand-written text-xs text-green p-1 pt-2 absolute bottom-0 right-0 bg-beige m-2">{{ drawData.signature }}</p>
    </div>
  </button>
  <div v-if="onModify" class="fixed z-40 w-screen h-screen bg-green/80 flex justify-center items-center top-0 left-0 pt-24">
    <div v-if="!onSignature" class="h-[90%] w-full m-12 rounded-xl" :class="!onDraw ? 'bg-beige p-8' : ''">
      <div v-if="!onWrite && !onDraw" class="edit-corner h-full w-full flex gap-12 p-12">
        <button @click="onWrite = true" class="bg-beige-light relative flex-1 max-h-full p-16 text-green text-xl font-bold">
          <span class="w-[96%] h-[96%] block absolute top-[2%] left-[2%] border border-beige-dark rounded-lg" />
          <WriteIcon class="mx-auto h-1/3 w-auto object-contain" />
          <p class="mt-16">Écrire</p>
        </button>
        <button @click="onDraw = true" class="bg-beige-light relative flex-1 h-full text-green text-xl font-bold">
          <span class="w-[96%] h-[96%] block absolute top-[2%] left-[2%] border border-beige-dark rounded-lg" />
          <DrawIcon class="mx-auto h-1/3 w-auto object-contain" />
          <p class="mt-16">Faire un dessin</p>
        </button>
      </div>
      <div v-if="onWrite" class="edit-corner w-full h-full p-6 flex flex-col items-end">
        <textarea v-model="textData.content" autofocus class="w-full h-full resize-none text-xl p-12 font-bold bg-transparent border-none outline-none">
        </textarea>
        <RoundButton @click="saveText" class="mt-10 min-h-[80px]" :color="COLOR.GREEN_MEDIUM_BEIGE"><CheckIcon /></RoundButton>
      </div>
      <div v-if="onDraw" class="w-full h-full p-0 flex flex-col items-end">
        <Draw @save="saveDraw" :lastDrawUrl="drawUrl" :ratio="ratio" />
      </div>
    </div>
  </div>
  <ModalView v-if="onSignature" :close="false" :click-outside="false">
    <div class="relative my-2 flex flex-col items-center">
      <h3 class="mt-8">Note le ou les prénoms des élèves qui ont vécu  ce souvenir au jardin :</h3>
      <input type="text" v-model="signature" class="mt-6 px-6 py-4 rounded-lg min-w-[400px]" placeholder="Ecris ici le ou les prénoms ">
      <RoundButton :isActive="signature != ''" @click="saveData" :color="COLOR.GREEN_MEDIUM_BEIGE" class="mt-12">
        <CheckIcon/>
      </RoundButton>
    </div>
  </ModalView>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../../common/DatabaseManager";
import {useMainStore} from "./../../../stores/mainStore";
import Draw from "./../Draw.vue"
import type { TextData, DrawData } from './../../../common/Interfaces'
import { base64ToFile } from './../../../common/Lib';
import { COLOR } from './../../../common/Constants';
import RoundButton from "./../../common/RoundButton.vue"
import ModalView from "./../../common/ModalView.vue";
import WriteIcon from "./../../../assets/svg/ico-write.svg?component"
import DrawIcon from "./../../../assets/svg/ico-draw.svg?component"
import CheckIcon from "./../../../assets/svg/ico-check.svg?component"
import PenIcon from "./../../../assets/svg/ico-pen.svg?component"

export default {
  name: "EditElementComponent",
  components: {
    Draw,
    RoundButton,
    ModalView,
    WriteIcon,
    DrawIcon,
    CheckIcon,
    PenIcon
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
      mainStore: useMainStore(),
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
    },
    COLOR() {
      return COLOR
    }
  },
  watch: {
    onModify(value:Boolean) {
      this.$emit('onModify', value)
    },
    signature(value: string) {
      this.textData.signature = this.drawData.signature = value;
    },
    'mainStore.logBookCloseElements': {
      handler() {
        this.onModify = false
        this.mainStore.logBookCloseElements = false
      },
      deep: true
    }
  },
  async mounted() {
    this.ratio = (this.$refs.container as HTMLElement).clientWidth / (this.$refs.container as HTMLElement).clientHeight;
    this.textData = await DatabaseManagerInstance.fetchText(this.pageId, this.slotNumber);
    this.drawData = await DatabaseManagerInstance.fetchDraw(this.pageId, this.slotNumber);
    this.signature = (this.textData.id ? this.textData.signature : this.drawData.signature);
    this.textData.slot = this.drawData.slot = this.slotNumber;
    this.textData.page = this.drawData.page = this.pageId;
  },
  methods: {
    modify() {
      this.onModify = true
      this.mainStore.isClosable = true
    },
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
      this.mainStore.isClosable = false
      this.mainStore.isModalOpen = false;
    },
    saveDraw(data:string) {
      this.onSignature = true
      this.mainStore.isModalOpen = true;

      this.drawData.file = base64ToFile(data);
    },
    saveText() {
      this.onSignature = true
      this.mainStore.isModalOpen = true;
    }
  },
};
</script>

<style scoped>
.edit-corner {
  background:
    linear-gradient(to right, #E5D9B6 8px, transparent 8px) 0 0,
    linear-gradient(to right, #E5D9B6 8px, transparent 8px) 0 100%,
    linear-gradient(to left, #E5D9B6 8px, transparent 8px) 100% 0,
    linear-gradient(to left, #E5D9B6 8px, transparent 8px) 100% 100%,
    linear-gradient(to bottom, #E5D9B6 8px, transparent 8px) 0 0,
    linear-gradient(to bottom, #E5D9B6 8px, transparent 8px) 100% 0,
    linear-gradient(to top, #E5D9B6 8px, transparent 8px) 0 100%,
    linear-gradient(to top, #E5D9B6 8px, transparent 8px) 100% 100%;

  background-repeat: no-repeat;
  background-size: 40px 40px;
}
</style>
