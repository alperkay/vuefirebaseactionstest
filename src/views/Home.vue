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
import { Vue } from "vue-class-component";

export default class Home extends Vue {
  private painting = false;
  private canvas: any;
  private ctx: any;
  private ongoingTouches: any[] = [];

  public mounted() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.canvas.addEventListener("touchstart", this.handleStart);
    this.canvas.addEventListener("touchend", this.handleEnd);
    this.canvas.addEventListener("touchmove", this.handleMove);
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

  private handleStart(evt: any) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.ongoingTouches.push(this.copyTouch(touches[i]));
      this.ctx.beginPath();
      this.ctx.lineCap = "round";
      this.ctx.fillStyle = "black";
      this.ctx.fill();
    }
  }

  private handleMove(evt: any) {
    evt.preventDefault();
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const idx = this.ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(
          this.ongoingTouches[idx].pageX,
          this.ongoingTouches[idx].pageY
        );
        this.ctx.lineTo(touches[i].pageX, touches[i].pageY);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i])); // swap in the new touch record
      }
    }
  }

  private handleEnd(evt: any) {
    evt.preventDefault();
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const idx = this.ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = 4;
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.moveTo(
          this.ongoingTouches[idx].pageX,
          this.ongoingTouches[idx].pageY
        );
        this.ctx.lineTo(touches[i].pageX, touches[i].pageY);
        this.ongoingTouches.splice(idx, 1); // remove it; we're done
      }
    }
  }

  private copyTouch({ identifier, pageX, pageY }: any) {
    return { identifier, pageX, pageY };
  }

  private ongoingTouchIndexById(idToFind: number) {
    for (let i = 0; i < this.ongoingTouches.length; i++) {
      const id = this.ongoingTouches[i].identifier;

      if (id == idToFind) {
        return i;
      }
    }
    return -1; // not found
  }
}
</script>

<style lang="scss">
#canvas {
  border: 2px solid black;
}
</style>
