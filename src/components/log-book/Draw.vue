<template>
  <div class="w-full h-full flex justify-center">
    <div class="relative bg-beige">
      <div class="absolute w-full h-full top-0 left-0 p-6 pointer-events-none"><div class="edit-corner w-full h-full pointer-events-none" /></div>
      <canvas ref="canvas" @pointerdown="startDrawing" @pointermove="draw" @pointerup="stopDrawing" @pointerout="stopDrawing" class="w-auto h-full border-none z-10"></canvas>
    </div>
    <!-- :style="'aspect-[' + ratio + ']'" -->
    <div class="flex flex-col ml-6 max-w-[340px]">
      <div class="flex flex-wrap bg-beige-medium rounded-lg gap-6 p-8">
        <div class="relative min-w-[100px] flex-1">
          <ButtonDraw @click="isOpenColor = !isOpenColor" :is-select="isOpenColor" text="Couleurs"><div class="w-full h-full rounded-full" :style="'background-color :' + currentColor" /></ButtonDraw>
          <div v-if="isOpenColor" class="flex flex-wrap justify-between absolute bg-white shadow-lg rounded-md p-6 w-64 top-0 -left-4 -translate-x-full">
            <button v-for="color in colors" :v-bind="color" class="w-12 h-12 rounded-full m-2 block" :style="'background-color: ' + color + ' ;'" @click="currentColor = color"></button>
          </div>
        </div>

        <div class="min-w-[100px] flex-1">
          <ButtonDraw @click="isErase = !isErase" :is-reverse="isErase" text="Gomme"><Eraser class="p-3" /></ButtonDraw>
        </div>

        <div class="relative min-w-[100px] flex-1">
          <ButtonDraw @click="isOpenSize = !isOpenSize" :is-select="isOpenSize" text="Taille">
            <Small v-if="currentSize === sizes[0]" class="p-3" />
            <Medium v-if="currentSize === sizes[1]" class="p-3" />
            <Large v-if="currentSize === sizes[2]" class="p-3" />
          </ButtonDraw>
          <div v-if="isOpenSize" class="flex items-center justify-between absolute bg-white shadow-lg rounded-md p-6 top-0 left-0 -translate-x-full">
            <button v-for="(size, index) in sizes" :v-bind="size" class="w-20 h-20 rounded-full p-0 bg-transparent text-beige-dark" @click="currentSize = size">
              <Small v-if="index === 0" class="p-3" />
              <Medium v-if="index === 1" class="p-3" />
              <Large v-if="index === 2" class="p-3" />
            </button>
          </div>
        </div>

        <div class="min-w-[100px] flex-1">
          <ButtonDraw @click="back" text="Annuler"><Undo class="p-3" /></ButtonDraw>
        </div>
      </div>

      <div class="flex bg-beige-medium rounded-lg gap-6 p-8 mt-4">
        <div class="min-w-[100px] flex-1">
          <ButtonDraw @click="clearCanvas" text="Supprimer"><Bin class="p-3" /></ButtonDraw>
        </div>
        <div class="flex flex-col items-center min-w-[100px] flex-1">
          <RoundButton @click="validate" :color="COLOR.GREEN_MEDIUM_BEIGE"><Check /></RoundButton>
          <p class="font-bold">Valider</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ButtonDraw from './ButtonDraw.vue';
import RoundButton from './../common/RoundButton.vue';
import { COLOR } from './../../common/Constants';
import Bin from "./../../assets/svg/ico-bin.svg?component";
import Eraser from "./../../assets/svg/ico-eraser.svg?component";
import Undo from "./../../assets/svg/ico-undo.svg?component";
import Small from "./../../assets/svg/draw/ico-small.svg?component";
import Medium from "./../../assets/svg/draw/ico-medium.svg?component";
import Large from "./../../assets/svg/draw/ico-large.svg?component";
import Check from "./../../assets/svg/ico-check.svg?component";

export default {
  components: { ButtonDraw, RoundButton, Bin, Eraser, Undo, Small, Medium, Large, Check },
  emits: ['save'],
  props: {
    lastDrawUrl: {
      type: String,
      default: ''
    },
    ratio: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      canvas: undefined as HTMLCanvasElement | undefined,
      drawing: false as Boolean,
      lastX: 0 as number,
      lastY: 0 as number,
      ctx: undefined as CanvasRenderingContext2D | undefined,
      canvasWidth: 400 as number,
      canvasHeight: 400  as number,
      currentColor: '#9B85FF' as string,
      colors: ['#E3F0A5', '#85A754', '#4D6B36', '#79CEE0', '#9B85FF', '#E8ADA4', '#EDBD56', '#FB6F4A', '#BB0F0F'] as string[],
      isOpenColor: false as boolean,
      isOpenSize: false as boolean,
      sizes: [5, 20, 40] as number[],
      currentSize: 20 as number,
      rect: {} as DOMRect,
      scaleX: 1 as number,
      scaleY: 1 as number,
      isErase: false as boolean,
      savedStates: [] as ImageData[],
    }
  },
  computed: {
    COLOR() {
      return COLOR
    }
  },
  watch: {
    currentColor() {
      this.isOpenColor = false
      this.isErase = false;
    },
    currentSize() {
      this.isOpenSize = false
    },
    isOpenColor(value) {
      if (value) {
        this.isOpenSize = false
      }
    },
    isOpenSize(value) {
      if (value) {
        this.isOpenColor = false
      }
    },
  },
  mounted() {
    this.onResize = this.onResize.bind(this)
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
    this.onResize()
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.onResize()
    this.loadImageAndDraw(this.lastDrawUrl)
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.currentSize;
    this.saveLastDraw()

    window.addEventListener('resize', this.onResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    loadImageAndDraw(url: string) {
      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        if (!this.ctx) return;
        this.ctx.drawImage(image, 0, 0);
        this.savedStates.pop();
        this.saveLastDraw()
      };

      image.src = url;

    },
    onResize() {
      if (!this.canvas) return;
      this.canvasWidth = this.canvas.clientWidth as number;
      this.canvasHeight = this.canvas.clientHeight as number;
      if (this.canvasWidth < this.canvasHeight * this.ratio) {
        this.canvasWidth = this.canvasHeight * this.ratio
      } else {
        this.canvasHeight = this.canvasWidth * (1/this.ratio)
      }

      this.rect = this.canvas.getBoundingClientRect();

      this.scaleX = this.canvas['width'] / this.canvasWidth;
      this.scaleY = this.canvas['height'] / this.canvasHeight;
    },
    startDrawing(e:MouseEvent) {
      this.drawing = true;
      this.lastX = (e.clientX - this.rect.left) * this.scaleX;
      this.lastY = (e.clientY - this.rect.top) * this.scaleY;
    },
    draw(e: MouseEvent) {
      if (!this.drawing || !this.ctx) return;
      this.ctx.globalCompositeOperation = this.isErase ? 'destination-out' : 'source-over'
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.currentSize;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.lastX = (e.clientX - this.rect.left) * this.scaleX;
      this.lastY = (e.clientY - this.rect.top) * this.scaleY;
      this.ctx.lineTo(this.lastX as number, this.lastY as number);
      this.ctx.stroke();
    },
    stopDrawing() {
      if (this.drawing) {
        this.drawing = false;
        this.saveLastDraw()
      }
    },
    saveLastDraw() {
      if (!this.canvas || !this.ctx) return;
      if (this.savedStates.length >= 5) {
        this.savedStates.shift();
      }
      this.savedStates.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    },
    back() {
      if (this.savedStates.length > 1 && this.canvas) {
        this.ctx?.clearRect(0, 0, this.canvas.width as number, this.canvas.width as number);
        this.ctx?.putImageData(this.savedStates[this.savedStates.length - 2], 0, 0);
        this.savedStates.pop();
      }
    },
    clearCanvas() {
      if(!this.canvas) return
      this.ctx?.clearRect(0, 0, this.canvas.width as number, this.canvas.height as number);
      this.saveLastDraw()
    },
    validate() {
      const dataUrl = this.canvas?.toDataURL();
      this.$emit('save', dataUrl)
    }
  }
}
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
