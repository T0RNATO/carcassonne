<script setup>
import {PieceObj} from "@/external/game_objects.ts";
import Road from "@/components/sectors/Road.vue";
import City from "@/components/sectors/City.vue";
import Monastery from "@/components/sectors/Monastery.vue";

defineProps({
    piece: PieceObj,
});

const sectors = {
    "road": Road,
    "city": City,
}
</script>

<template>
<svg viewBox="0 0 100 100">
    <rect x="-10" y="-10" width="120" height="120" stroke="none" filter="url('#noise')" fill="rgb(34 197 94)"/>
    <component v-for="sector in piece.sides.filter(side => side.type !== 'field')" :sector="sector" :is="sectors[sector.type]"/>
    <Monastery v-if="piece.monastery"/>
</svg>
</template>

<style scoped>
svg {
    width: 100px;
    aspect-ratio: 1/1;
}
</style>