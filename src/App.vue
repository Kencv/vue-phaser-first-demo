<script setup lang="ts">
import { onDeactivated, onMounted, onUnmounted, ref } from "vue";
import Game from "./game";

const canvasRef = ref<any>(null);
const PhaserMain = ref<Game>(new Game());
onMounted(() => {
  PhaserMain.value.canvas.id = "phaser-canvas"; // 设置Canvas的id，用于后续获取
  canvasRef.value.appendChild(PhaserMain.value.canvas);
});

onUnmounted(() => {
  PhaserMain.value.destroy(true);
});
</script>

<template>
  <div id="canvas-container" ref="canvasRef"></div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
