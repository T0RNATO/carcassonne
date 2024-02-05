<script setup lang="ts">
import {RoadSector} from "@/external/game_objects.js";
import {computed} from "vue";

const props = defineProps<{
    sector: RoadSector
}>();

const num_sides = computed(() => {
    return props.sector.sides.length + props.sector.visual_sides.length;
})

const sides = computed(() => {
    const s = [...props.sector.sides];
    const vs = props.sector.visual_sides;
    // Ignore this jankiness, a simple sort did not suffice
    if (vs.length) {
        if (vs[0] < s[0]) {
            s.unshift(vs[0]);
        } else {
            s.push(vs[0]);
        }
    }
    return s;
})
</script>

<template>
    <g fill="hsl(0 0% 95%)" stroke="black" stroke-width="1" :transform="`rotate(${sides[0] * 90} 50 50)`" filter="url(#pencilTexture4)">
        <!--Road on just one side-->
        <rect x="45" width="10" y="-10" height="55" v-if="num_sides === 1"/>
        <!--Road curve on two adjacent sides-->
        <path d="M45,0 Q45,55 100,55 V45 Q55,45 55,0 H45" v-else-if="num_sides === 2 && (sides[0] + 1) % 4 === sides[1]"/>
        <!--Straight road on two opposite sides-->
        <rect x="45" width="10" y="-10" height="120" v-else-if="num_sides === 2"/>
        <!--Three way junction of road-->
        <path d="M55,0 Q55,45 100,45 H110 V55 H100 Q55,55 55,100 V110 H45 V-10 H55 V0 M55,25 V75 Q55,50 80,50 Q55,50 55,25" v-else-if="num_sides === 3"/>
        <!--Four way junction, like this will be used-->
        <path d="M55,0 Q55,45 100,45 H110 V55 H100 Q55,55 55,100 V110 H45 V100 Q45,55 0,55 H-10 V45 H0 Q45,45 45,0 V-10 H55 V0 M50,25 Q50,50 25,50 Q50,50 50,75 Q50,50 75,50 Q50,50 50,25" v-else/>
    </g>
</template>

<style scoped>

</style>