<template>
  <div class="w-full h-full flex">
    <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @mouseout="stopDrawing" class="w-full h-full" :style="'width:' + canvasWidth + 'px; height:' + canvasHeight + 'px'"></canvas>
    <div class="flex flex-col items-center">
      <div class="relative">
        <button @click="isOpenColor = !isOpenColor">Couleurs</button>
        <div v-if="isOpenColor" class="flex flex-wrap justify-between absolute bg-white shadow-lg rounded-lg p-6 w-64 top-0 left-0 -translate-x-full">
          <button v-for="color in colors" :v-bind="color" class="w-12 h-12 rounded-full m-2 block" :style="'background-color: ' + color + ' ;'" @click="currentColor = color"></button>
        </div>
      </div>
      <div class="relative">
        <button @click="isOpenSize = !isOpenSize">Taille</button>
        <div v-if="isOpenSize" class="flex items-center justify-between absolute bg-white shadow-lg rounded-lg p-6 top-0 left-0 -translate-x-full">
          <button v-for="size in sizes" :v-bind="size" class="rounded-full m-2 block p-2" :style="'width:' + size * 1.5 + 'px; height:' + size * 1.5 + 'px'" @click="currentSize = size"></button>
        </div>
      </div>
      <button @click="isErase = !isErase" :style="'background: ' + (isErase ? 'blue' : 'red')">Gomme</button>
      <button @click="clearCanvas">Recommencer</button>
      <button @click="back">Annuler</button>
      <button @click="validate">Valider</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
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
      currentColor: '#E3F0A5' as string,
      colors: ['#E3F0A5', '#85A754', '#4D6B36', '#79CEE0', '#9B85FF', '#E8ADA4', '#EDBD56', '#FB6F4A', '#BB0F0F'] as string[],
      isOpenColor: false as boolean,
      isOpenSize: false as boolean,
      sizes: [5, 20, 40] as number[],
      currentSize: 5 as number,
      rect: {} as DOMRect,
      scaleX: 1 as number,
      scaleY: 1 as number,
      isErase: false as boolean,
      savedStates: [] as ImageData[],
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
      this.scaleX = 1;
      this.scaleY = 1;
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
      if (this.savedStates.length > 1) {
        this.ctx?.clearRect(0, 0, this.canvasWidth as number, this.canvasHeight as number);
        this.ctx?.putImageData(this.savedStates[this.savedStates.length - 2], 0, 0);
        this.savedStates.pop();
      }
    },
    clearCanvas() {
      this.ctx?.clearRect(0, 0, this.canvasWidth as number, this.canvasHeight as number);
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
canvas {
  border: 1px solid #000;
}
</style>
