<script setup lang="ts">
import {ref} from "vue";

// The translation applied to the object
const displayX = ref(0);
const displayY = ref(0);

// Distance between cursor and origin of object
let offsetX = 0;
let offsetY = 0;

let dragging = false;

const zoom_level = ref(1);

function mouseMove(ev: MouseEvent) {
    if (dragging) {
        displayX.value = (ev.clientX - offsetX) / zoom_level.value;
        displayY.value = (ev.clientY - offsetY) / zoom_level.value;
    }
}

function mouseDown(ev: MouseEvent) {
    // Adjust offsetX and offsetY based on zoom_level
    offsetX = (ev.clientX - displayX.value * zoom_level.value);
    offsetY = (ev.clientY - displayY.value * zoom_level.value);
    dragging = true;
}

function mouseUp() {
    offsetX = 0;
    offsetY = 0;
    dragging = false;
}

function zoom(ev: WheelEvent) {
    const direction = Math.sign(ev.deltaY);

    const old_zoom = zoom_level.value;
    const new_zoom = old_zoom * Math.pow(1.5, -direction);
    zoom_level.value = new_zoom;

    const dx = (ev.clientX * (1 - new_zoom / old_zoom)) / new_zoom;
    const dy = (ev.clientY * (1 - new_zoom / old_zoom)) / new_zoom;

    displayX.value = displayX.value + dx;
    displayY.value = displayY.value + dy;
}

</script>

<template>
    <div class="w-screen h-screen" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @wheel="zoom">
        <div class="will-change-transform origin-top-left"
             :style="{transform: `scale(${zoom_level}) translate(${displayX}px, ${displayY}px)`}">
            <slot/>
        </div>
    </div>
</template>

<style scoped>

</style>