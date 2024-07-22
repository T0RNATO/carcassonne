<script setup lang="ts">
import {Location, PieceObj, PlacedPieceObj} from "@/external/game_objects"
import {generateTiles} from "@/external/utils";
import Piece from "@/components/Piece.vue";
import type {Ref} from "vue";
import {ref} from "vue";
import PlacedPiece from "@/components/PlacedPiece.vue";
import ValidLocation from "@/components/ValidLocation.vue";
import FilterDefs from "@/components/FilterDefs.vue";
import Pan from "@/components/Pan.vue";
import {useStore} from "@/external/store";

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

interface st {
    board: PlacedPieceObj[]
}

const store = useStore() as st;

const tile_bag: Array<PieceObj> = generateTiles();
const currentTile: Ref<PieceObj> = ref();
// to be removed
currentTile.value = tile_bag.find(tile => tile.id === 61);

function validRotationsForTileToBePlacedAtLocation(tile: PieceObj, x: number, y: number): Array<number> {
    if (store.board.find(piece => piece.x === x && piece.y === y)) {
        return [];
    }

    const bottom = store.board.find(piece => piece.x === x && piece.y === y + 1);
    const top = store.board.find(piece => piece.x === x && piece.y === y - 1);
    const left = store.board.find(piece => piece.x === x - 1 && piece.y === y);
    const right = store.board.find(piece => piece.x === x + 1 && piece.y === y);

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

    for (const piece of store.board) {
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
    const rotation = loc.rotations[rot];
    store.board.push(new PlacedPieceObj(currentTile.value, rotation, loc.x, loc.y));
    tile_bag.splice(tile_bag.indexOf(currentTile.value), 1);
    // remove
    currentTile.value = tile_bag[Math.floor(Math.random() * tile_bag.length)];
    updateValidLocationsOfTile(currentTile.value);
}
</script>

<template>
    <FilterDefs/>
    <Pan @click-event="console.log($event)">
        <PlacedPiece :piece="piece" v-for="(piece, i) in store.board" :key="i"/>
        <ValidLocation :loc="loc" :piece="currentTile" v-for="(loc, i) in validLocations" :key="i" @clicked="placeTile"/>
    </Pan>
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

</style>