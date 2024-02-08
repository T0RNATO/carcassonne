<script setup lang="ts">
import {ref} from "vue";

const displayX = ref(0);
const displayY = ref(0);

const x = ref(0);
const y = ref(0);

let offsetX = 0;
let offsetY = 0;
let dragging = false;

const zoom_level = ref(10);

function mouseMove(ev: MouseEvent) {
    x.value = ev.clientX;
    y.value = ev.clientY;
    if (dragging) {
        displayX.value = (ev.clientX - offsetX) / zoom_level.value * 10;
        displayY.value = (ev.clientY - offsetY) / zoom_level.value * 10;
    }
}

function mouseDown(ev: MouseEvent) {
    offsetX = ev.clientX - displayX.value;
    offsetY = ev.clientY - displayY.value;
    dragging = true;
}

function mouseUp(ev) {
    offsetX = 0;
    offsetY = 0;
    dragging = false;
}

function zoom(ev: WheelEvent) {
    zoom_level.value = Math.max(Math.round(zoom_level.value - Math.sign(ev.deltaY)), 1);
    console.log(zoom_level.value)
}

</script>

<template>
    <div class="w-screen h-screen" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @wheel="zoom">
        <div class="will-change-transform"
             :style="{transform: `scale(${zoom_level * 0.1}) translate(${displayX}px, ${displayY}px)`,
        }">
            <slot/>
        </div>
    </div>
</template>

<style scoped>

</style>