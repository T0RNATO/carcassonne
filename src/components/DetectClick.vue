<script setup>
let x = 0;
let y = 0;

const emit = defineEmits([
    "clicked"
])

function click(ev) {
    if (x === ev.x && y === ev.y) {
        emit("clicked")
    }
}
</script>

<template>
<div @mousedown="x = $event.x; y = $event.y" @mouseup="click">
    <slot/>
</div>
</template>