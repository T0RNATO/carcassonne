<script setup>
import Piece from "@/components/Piece.vue";
import {PlacedPieceObj} from "@/external/game_objects";

defineProps({
    piece: PlacedPieceObj,
});
</script>

<template>
    <div :style="{
        left: `${(piece.x + 5) * 100}px`,
        top: `${(piece.y + 3) * 100}px`,
        transform: `rotate(${piece.rotation * -90}deg)`,
    }" class="absolute">
        <Piece :piece="piece"/>
    </div>
</template>

<style scoped>

</style>