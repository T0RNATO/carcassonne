<script setup lang="ts">
import {Location, PieceObj} from "@/external/game_objects";
import Piece from "@/components/Piece.vue";
import {ref, watch} from "vue";
import DetectClick from "@/components/DetectClick.vue";

const props = defineProps<{
    loc: Location,
    piece: PieceObj,
}>();

defineEmits(["clicked"]);

watch(props.piece, () => {
    currentRot.value = 0;
});

const currentRot = ref(0);

function detectKeys(ev) {
    if (ev.key === "r") {
        currentRot.value++;
        currentRot.value %= props.loc.rotations.length;
    }
}

// document isn't defined in templates for some reason
function mouseover() {addEventListener('keydown', detectKeys)}
function mouseout() {removeEventListener('keydown', detectKeys)}
</script>

<template>
    <DetectClick @clicked="$emit('clicked', loc, currentRot)">
        <div :style="{
            left: `${(loc.x + 5) * 100}px`,
            top: `${(loc.y + 3) * 100}px`,
        }" class="loc">
            <div class="val"></div>
            <Piece :piece="piece" :style="{transform: `rotate(${loc.rotations[currentRot] * -90}deg)`}" class="hidden opacity-10"
                   @mouseover="mouseover"
                   @mouseout="mouseout"
            />
        </div>
    </DetectClick>
</template>

<style scoped>
.loc {
    width: 100px;
    aspect-ratio: 1/1;
    position: absolute;
}
.val {
    @apply w-full h-full outline-green-400 outline-offset-[-20px] outline-8;
    outline-style: ridge;
}
.loc:hover > .val {display: none}
.loc:hover > svg {display: block}
</style>