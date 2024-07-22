import {defineStore} from "pinia";
import {Sector, PlacedPieceObj} from "./game_objects.ts";

interface store {
    hoveredSectors: number[],
    board: PlacedPieceObj[]
}

export const useStore = defineStore("state", {
    state: (): store => ({
        hoveredSectors: [],
        board: []
    }),
    actions: {
        updateConnected(piece: PlacedPieceObj, sector: Sector) {
            recurse(piece, sector)
        }
    }
})

function side(piece: PlacedPieceObj, side: number): PlacedPieceObj {
    const s = (side + piece.rotation) % 4;
    if (s == 0) {
        return this.board.find(p => p.x == piece.x && p.y == piece.y - 1);
    }
}

function recurse(piece: PlacedPieceObj, sector: Sector) {
    for (const side of sector.sides) {
        const tile = piece.piece(side);
        if (tile) {
            recurse(tile, tile.sectors)
        }
    }
}