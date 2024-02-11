// @ts-ignore
import tiles from "@/external/tiles.txt?raw";
import {CitySector, FieldSector, PieceObj, RoadSector, Sector} from "./game_objects";

// @ts-ignore
export const range = (n: number) => [...Array(n).keys()]

export const enum messages {
    // Incoming
    YourTurn = "your_turn",
}

const sectorKey = {
    "r": () => new RoadSector([]),
    "c": () => new CitySector([]),
    "f": () => new FieldSector([])
}

function parseTileFeature(feature: string): Sector | null {
    const details = feature.substring(1).split(",");
    const type = feature[0];

    if (type === "m") {return}

    const sector: Sector = sectorKey[type]();

    for (const detail of details) {
        if (detail === "*") {
            if (type === "c") {(sector as CitySector).shields++;}
            else {(sector as RoadSector).inn = true;}
        } else if (detail[0] === "[") {
            if (type === "r") {(sector as RoadSector).visual_sides = JSON.parse(detail);}
            else {(sector as FieldSector).connected_cities = JSON.parse(detail);}
        } else if (detail.includes(".")) {
            (sector as FieldSector).field_sides.push(Number(detail));
        } else {
            sector.sides.push(parseInt(detail));
        }
    }
    return sector;
}

export function generateTiles() {
    const tile_bag: Array<PieceObj> = [];
    for (const [id, line] of tiles.split("\n").entries()) {
        if (line === "" || line === "\r") {continue;}
        const content = line.split(" #")[0];
        const [count, ...sections] = content.split(" ");

        const features: Array<Sector> = [];

        for (const feature of sections) {
            const sector = parseTileFeature(feature);
            if (sector) {
                features.push(sector);
            }
        }

        for (let i = 0; i < parseInt(count); i++){
            tile_bag.push(new PieceObj(features, id, sections[1] === "m"));
        }
    }
    return tile_bag
}