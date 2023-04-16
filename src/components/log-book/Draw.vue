<template>
  <div class="w-full h-full">
    <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" class="w-full h-full"></canvas>
    <button @click="clearCanvas">Clear</button>
    <button @click="validate">Valider</button>
  </div>
</template>

<script lang="ts">
export default {
  emits: ['save'],
  data() {
    return {
      canvas: undefined as HTMLCanvasElement | undefined,
      drawing: false as Boolean,
      lastX: 0 as Number,
      lastY: 0 as Number,
      ctx: undefined as CanvasRenderingContext2D | undefined,
      canvasWidth: 400 as Number,
      canvasHeight: 400  as Number,
      color: '#000' as String,
      lineWidth: 5 as Number,
      rect: {} as DOMRect,
      scaleX: 1 as number,
      scaleY: 1 as number,
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
    this.canvasWidth = this.canvas.clientWidth as number;
    this.canvasHeight = this.canvas.clientHeight as number;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.lineWidth;

    this.onResize()

    this.onResize = this.onResize.bind(this)
    window.addEventListener('resize', this.onResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      if (!this.canvas) return;
      this.rect = this.canvas.getBoundingClientRect();
      this.scaleX = this.canvas.width / this.rect.width;
      this.scaleY = this.canvas.height / this.rect.height;
    },
    startDrawing(e:MouseEvent) {
      this.drawing = true;
      this.lastX = (e.clientX - this.rect.left) * this.scaleX;
      this.lastY = (e.clientY - this.rect.top) * this.scaleY;
    },
    draw(e:MouseEvent) {
      if (!this.drawing || !this.ctx) return;
      this.ctx.strokeStyle = this.color;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.lastX = (e.clientX - this.rect.left) * this.scaleX;
      this.lastY = (e.clientY - this.rect.top) * this.scaleY;
      this.ctx.lineTo(this.lastX as number, this.lastY as number);
      this.ctx.stroke();
    },
    stopDrawing() {
      this.drawing = false;
    },
    clearCanvas() {
      this.ctx?.clearRect(0, 0, this.canvasWidth as number, this.canvasHeight as number);
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
