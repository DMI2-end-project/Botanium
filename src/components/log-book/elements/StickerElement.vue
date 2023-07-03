<template>
  <div>
    <button
        class="sticker-element w-full h-min bg-beige-medium transition-opacity text-beige-dark rounded-full relative p-0 flex justify-center items-center outline outline-8 transition-all duration-400"
        :class="`${onModify ? 'outline-yellow' : 'outline-transparent'} ${stickerData.idSticker >= 0 ? 'bg-opacity-0' : 'bg-opacity-50'}`"
        @click="modify">
      <img v-if="stickerData.idSticker >= 0" alt="" :src="getStickerUrl(stickerData.idSticker)"
           class="h-full w-full rounded-full object-contain absolute"><!--  shadow-md -->
      <!--SvgIcon v-if="stickerData.idSticker >= 0" source="stickers" :name="`${stickerData.idSticker}`"
               class="h-full w-full rounded-full object-contain absolute shadow-md"/-->
      <p v-if="!(stickerData.idSticker >= 0)" class="absolute">
        <Stickers class="w-2/3 mx-auto" :class="onModify ? 'text-yellow' : ''"/>
      </p>
    </button>
    <Transition :name="isPageLeft ? 'translateLeft' : 'translateRight'">
      <div v-if="onModify" class="fixed z-40 w-screen h-screen top-0 left-0 flex items-end">
        <div class="relative h-5/6 mt-auto w-fit flex items-center" :class="isPageLeft ? 'ml-auto' : 'mr-auto'">
          <!-- <button v-if="stickerData.idSticker !== stickerDataLast.idSticker" @click="saveData" class="absolute z-10 h-24 w-24 rounded-full top-0 bottom-0 my-auto h-fit" :class="isPageLeft ? '-left-12' : '-right-12'">Valider</button> -->

          <Transition name="scaleButtonBg">
            <RoundButton @click="saveData" :color-bg="COLOR.BEIGE" :color="COLOR.GREEN_MEDIUM_BEIGE"
                         class="absolute top-0 bottom-0 my-auto h-fit rounded-full"
                         :class="isPageLeft ? '-left-20' : '-right-20'">
              <Check/>
            </RoundButton>
          </Transition>
          <!-- <RoundButton v-if="stickerData.idSticker === stickerDataLast.idSticker" @click="close" :color-bg="COLOR.BEIGE" :color="COLOR.RED" class="absolute z-10 top-0 bottom-0 my-auto h-fit rounded-full" :class="isPageLeft ? '-left-20' : '-right-20'"><Cross /></RoundButton> -->


          <div class="bg-beige p-8 h-full" :class="isPageLeft ? '' : 'scroll-left'">
            <div class="overflow-y-scroll h-full">
              <p>Les autocollants du jardin</p>
              <div class="grid grid-cols-3 gap-8 mt-10 mx-8">
                <div v-for="index in numberStickers" :v-bind="index" class="w-32 h-32 flex justify-center items-center">
                  <button @click="changeSticker(index)"
                          class="!bg-beige-medium p-2 overflow-hidden rounded-full shadow-md"
                          :class="stickerData.idSticker === index ? 'outline outline-8 outline-yellow' : ''">
                    <img alt="" :src="getStickerUrl(index)" class="object-contain w-full h-full pointer-events-none">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import {useLogBookStore} from "../../../stores/logBookStore";
import {DatabaseManagerInstance} from "./../../../common/DatabaseManager";
import {AUDIO, COLOR, LOGBOOK_STEP} from "./../../../common/Constants";
import type {StickerData} from './../../../common/Interfaces'
import RoundButton from './../../common/RoundButton.vue';
import SvgIcon from "../../common/SvgIcon.vue";

import Check from "./../../../assets/svg/ico-check.svg?component";
import Cross from "./../../../assets/svg/ico-cross.svg?component";
import Stickers from "./../../../assets/svg/ico-stickers.svg?component";
import {AudioManagerInstance} from "../../../common/AudioManager";

export default {
  name: "StickerElementComponent",
  components: {
    SvgIcon,
    RoundButton,
    Check,
    Cross,
    Stickers
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
    isPageLeft: {
      type: Boolean,
      default: false
    }
  },
  emits: ['onModify'],
  data: () => {
    return {
      logBookStore: useLogBookStore(),
      stickerData: {} as StickerData,
      stickerDataLast: {} as StickerData,
      onModify: false as boolean,
      stickers: [] as Array<StickerData>,
      stickerSelected: {} as StickerData,
      numberStickers: 12 as number
    }
  },
  computed: {
    COLOR() {
      return COLOR
    }
  },
  watch: {
    onModify(value: boolean) {
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
    modify() {
      this.onModify = true;
      this.logBookStore.currentStep = LOGBOOK_STEP.SELECT_STICKER;
    },
    getStickerUrl(idSticker: number): string {
      return '/images/stickers/' + idSticker + '.png'
    },
    changeSticker(index: number) {
      if (this.stickerData.idSticker === index) {
        this.stickerData = {idSticker: -1} as StickerData
        return
      }
      this.stickerData.idSticker = index;
      AudioManagerInstance.play(AUDIO.POP);
    },
    async saveData() {
      if (this.stickerDataLast.id) {
        await DatabaseManagerInstance.deleteSticker(this.stickerDataLast);
      }
      this.stickerData = await DatabaseManagerInstance.createSticker(this.stickerData);
      this.stickerDataLast = Object.assign({}, this.stickerData)

      this.onModify = false;
      this.logBookStore.currentStep = LOGBOOK_STEP.SELECT_ACTION;
    },
    async close() {
      this.onModify = false
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
