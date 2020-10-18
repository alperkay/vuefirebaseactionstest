<template>
  <div class="home">
    <canvas v-drawable id="canvas"></canvas>
    <input class="size-input" type="number" v-model="size" placeholder="size" />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Home extends Vue {
  private size = 5;
}
</script>

<style lang="scss">
#canvas {
  border: 2px solid black;
}

.size-input {
  position: absolute;
  top: 100px;
  left: 100px;
}
</style>
