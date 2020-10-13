<template>
  <div class="home">
    <canvas
      @mousedown="startPosition"
      @mouseup="finishedPosition"
      @mousemove="draw"
      id="canvas"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { CanvasHTMLAttributes } from "vue";
import { Options, Vue } from "vue-class-component";

export default class Home extends Vue {
  private painting = false;
  private canvas: any;
  private ctx: any;

  public mounted() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.canvas.addEventListener("touchstart", this.startPosition);
    this.canvas.addEventListener("touchend", this.finishedPosition);
    this.canvas.addEventListener("touchmove", this.draw);
  }

  private startPosition(e: MouseEvent) {
    this.painting = true;
    this.draw(e);
  }

  private finishedPosition() {
    this.painting = false;
    this.ctx.beginPath();
  }

  private draw(e: MouseEvent) {
    if (!this.painting) return;
    this.ctx.lineWidth = 10;
    this.ctx.lineCap = "round";

    this.ctx.lineTo(e.clientX, e.clientY);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(e.clientX, e.clientY);
  }
}
</script>

<style lang="scss">
#canvas {
  border: 2px solid black;
}
</style>
