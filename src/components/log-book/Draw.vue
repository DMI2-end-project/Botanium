<template>
  <div class="w-full h-full">
    <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" class="w-full h-full"></canvas>
    <button @click="clearCanvas">Clear</button>
    <button @click="validate">Valider</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawing: false,
      lastX: 0,
      lastY: 0,
      ctx: null,
      canvasWidth: 400,
      canvasHeight: 400,
      color: '#000',
      lineWidth: 5,
    }
  },
  mounted() {
    this.canvasWidth = this.$refs.canvas?.clientWidth;
    this.canvasHeight = this.$refs.canvas?.clientHeight;
    this.ctx = this.$refs.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.lineWidth;

    this.rect = this.$refs.canvas.getBoundingClientRect();
    this.scaleX = this.$refs.canvas.width / this.rect.width;
    this.scaleY = this.$refs.canvas.height / this.rect.height;

    this.onResize = this.onResize.bind(this)
    window.addEventListener('resize', this.onResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.rect = this.$refs.canvas.getBoundingClientRect();
      this.scaleX = this.$refs.canvas.width / this.rect.width;
      this.scaleY = this.$refs.canvas.height / this.rect.height;
    },
    startDrawing(e) {
      this.drawing = true;
      this.lastX = (e.clientX - this.rect.left) * this.scaleX;
      this.lastY = (e.clientY - this.rect.top) * this.scaleY;
    },
    draw(e) {
      if (!this.drawing) return;
      this.ctx.strokeStyle = this.color;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.lastX = (e.clientX - this.rect.left) * this.scaleX;
      this.lastY = (e.clientY - this.rect.top) * this.scaleY;
      this.ctx.lineTo(this.lastX, this.lastY);
      this.ctx.stroke();
    },
    stopDrawing() {
      this.drawing = false;
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    validate() {
      const dataUrl = this.$refs.canvas.toDataURL();
      this.$emit('save', dataUrl)
      // console.log(dataUrl)
      // const link = document.createElement('a');
      // link.href = dataUrl;
      // link.download = 'my_drawing.png';
      // link.click();
    }
  }
}
</script>

<style scoped>
canvas {
  border: 1px solid #000;
}
</style>
