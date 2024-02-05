<script setup lang="ts">
import {Location, PieceObj, PlacedPieceObj} from "@/external/game_objects"
import {generateTiles, vPan, wasAnActualClick} from "@/external/utils";
import Piece from "@/components/Piece.vue";
import type {Ref} from "vue";
import {ref} from "vue";
import PlacedPiece from "@/components/PlacedPiece.vue";
import ValidLocation from "@/components/ValidLocation.vue";
import FilterDefs from "@/components/FilterDefs.vue";

const props = defineProps<{
    ws: WebSocket,
}>();

// props.ws.onmessage = (ev: MessageEvent) => {
//     const msg = JSON.parse(ev.data);
//     console.log(msg);
//     if (msg.type === messages.YourTurn) {
//         currentTile.value = tile_bag.find(tile => tile.id === msg.message["piece"]);
//     }
// }

// to be removed
function pp(id, x, y) {
    return new PlacedPieceObj(tile_bag.find(tile => tile.id === id), 0, x, y);
}

const tile_bag: Array<PieceObj> = generateTiles();
const board: Ref<Array<PlacedPieceObj>> = ref([pp(4,0,0),pp(4,1,-1),pp(0,-1,-1),pp(13,-1,-2)]);
const currentTile: Ref<PieceObj> = ref();
// to be removed
currentTile.value = tile_bag.find(tile => tile.id === 51);

function validRotationsForTileToBePlacedAtLocation(tile: PieceObj, x: number, y: number): Array<number> {
    if (board.value.find(piece => piece.x === x && piece.y === y)) {
        return [];
    }

    const bottom = board.value.find(piece => piece.x === x && piece.y === y + 1);
    const top = board.value.find(piece => piece.x === x && piece.y === y - 1);
    const left = board.value.find(piece => piece.x === x - 1 && piece.y === y);
    const right = board.value.find(piece => piece.x === x + 1 && piece.y === y);

    const validRotations = [];

    for (const rotation of [0,1,2,3]) {
        // Direction is valid either if there is no piece there or if the piece there's side matches the side of the tile
        if (bottom && bottom.top().type !== tile.side(rotation + 2).type) {continue}
        if (left && left.right().type !== tile.side(rotation + 3).type) {continue}
        if (top && top.bottom().type !== tile.side(rotation + 4).type) {continue}
        if (right && right.left().type !== tile.side(rotation + 5).type) {continue}
        // If all directions are valid (i.e., don't continue the loop), add the rotation to the list of valid rotations
        validRotations.push(rotation);
    }
    return validRotations;
}

const validLocations: Ref<Array<Location>> = ref();
function updateValidLocationsOfTile(tile: PieceObj) {
    const scanned: string[] = [];
    const vLocations = [];

    for (const piece of board.value) {
        const x = piece.x;
        const y = piece.y;

        for (const [dx, dy] of [[0,1],[0,-1],[-1,0],[1,0]]) {
            // .includes is literally a default function, why is it not recognized?
            // noinspection TypeScriptUnresolvedReference
            if (scanned.includes(`${dx+x},${dy+y}`)) {continue}
            scanned.push(`${dx+x},${dy+y}`);
            const validRotations = validRotationsForTileToBePlacedAtLocation(tile, x + dx, y + dy);
            if (validRotations.length) {
                vLocations.push({ x: x+dx, y: y+dy, rotations: validRotations });
            }
        }
    }
    validLocations.value = vLocations;
}
updateValidLocationsOfTile(currentTile.value);

function placeTile(loc: Location, rot: number) {
    // ignore this massive hack
    wasAnActualClick.then(() => {
        const rotation = loc.rotations[rot];
        board.value.push(new PlacedPieceObj(currentTile.value, rotation, loc.x, loc.y));
        tile_bag.splice(tile_bag.indexOf(currentTile.value), 1);
        // remove
        currentTile.value = tile_bag[Math.floor(Math.random() * tile_bag.length)];
        updateValidLocationsOfTile(currentTile.value);
    },()=>{});
}
</script>

<template>
    <FilterDefs/>
    <div class="main" v-pan>
        <PlacedPiece :piece="piece" v-for="(piece, i) in board" :key="i"/>
        <ValidLocation :loc="loc" :piece="currentTile" v-for="(loc, i) in validLocations" :key="i" @clicked="placeTile"/>
    </div>
    <div class="absolute bottom-0 right-0 p-4 rounded-tl-md bg-gray-700">
        Current Piece:
        <Piece :piece="currentTile" v-if="currentTile"/>
    </div>
</template>

<style>
body {
    @apply overflow-hidden;
}
</style>

<style scoped>
.main {
    @apply max-w-[90vw] flex flex-wrap will-change-transform;
}
</style>