<script setup>
import {CitySector} from "@/external/game_objects.ts";
import {range} from "@/external/utils.ts";
import {useStore} from "@/external/store.ts";

defineProps({
    sector: CitySector
})

const store = useStore()

const fill = "#e8a66f";
const stroke = "rgb(169,115,69)";
</script>

<template>
    <g :fill="store.hoveredSectors.includes(sector.uid) ? 'blue' : fill" :stroke="stroke"
       stroke-width="3" :transform="`rotate(${sector.sides[0] * 90} 50 50)`"
       filter="url(#city)"
       @mouseover="console.log('test')"
    >
        <!--City on just one side-->
        <ellipse rx="50" ry="30" cx="50" cy="0" v-if="sector.sides.length === 1"/>
        <!--City on two adjacent sides-->
        <rect x="35" y="-35" width="141" height="100" :fill="fill" transform="rotate(45 100 0)" v-else-if="sector.sides.length === 2 && (sector.sides[0] + 1) % 4 === sector.sides[1]"/>
        <!--City on two opposite sides-->
        <path d="M0,0 Q50,-50 100,0Q50,50 100,100Q50,150 0,100Q50,50 0,0" v-else-if="sector.sides.length === 2"/>
        <!--City on three sides-->
        <path d="M0,0 Q50,50 0,100 V110 H110 V-10 H0 V0" v-else-if="sector.sides.length === 3"/>
        <!--Entire city piece-->
        <rect width="120" height="120" x="-10" y="-10" stroke="none" v-else/>
    </g>
    <!-- Shields -->
    <g :transform="`rotate(${sector.sides[0] * 90} 50 50)`">
<!--        <path d="m6,24 7-23 7,23 L1,10 h24 L6,24" v-for="i in range(sector.shields)" fill="yellow" :transform="`translate(${77 - i * 20},3) scale(0.8)`"/>-->
        <path d="M10,0Q13,4 20,0Q15,18 10,20Q5,18 0,0Q7,4 10,0" v-for="i in range(sector.shields)" fill="#54a6d6" stroke="white" :transform="`translate(${77 - i * 20},3) scale(0.8)`"/>
    </g>
</template>

<style scoped>

</style>