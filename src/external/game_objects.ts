export class PieceObj {
    sides: Array<Sector>;
    monastery: boolean;
    id: number;
    constructor(sides: Array<Sector>, id: number, monastery: boolean = false) {
        this.sides = sides;
        this.monastery = monastery;
        this.id = id;
    }

    side(direction: number): Sector {
        return this.sides.find(se => se.sides.includes(direction % 4));
    }
}

export class PlacedPieceObj extends PieceObj {
    rotation: number;
    x: number;
    y: number;
    constructor(piece: PieceObj, rotation: number, x: number, y: number) {
        super(piece.sides, piece.id, piece.monastery);
        this.rotation = rotation;
        this.x = x;
        this.y = y;
    }
    top(): Sector {return this.side(this.rotation)}
    right(): Sector {return this.side(this.rotation + 1)}
    bottom(): Sector {return this.side(this.rotation + 2)}
    left(): Sector {return this.side(this.rotation + 3)}
}

type Meeples = {
    red: number,
    blue: number,
    green: number,
    yellow: number,
    black: number
}

let sectorCount = 0;

export class Sector {
    meeples: Meeples;
    type: "city" | "field" | "road";
    sides: Array<number>;
    uid: number;
    constructor(sides: number[]) {
        this.sides = sides;
        this.meeples = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
            black: 0
        };
        this.uid = sectorCount;
        sectorCount++;
    }
}

export class CitySector extends Sector {
    shields: number;
    cathedral: boolean;
    constructor(sides: Array<number>, shields=0, cathedral=false) {
        super(sides);
        this.shields = shields;
        this.cathedral = cathedral;
        this.type = "city";
    }
}

export class FieldSector extends Sector {
    field_sides: Array<number>;
    connected_cities: Array<number> | Boolean;
    constructor(sides: Array<number>, field_sides: Array<number> = [], connected_cities: Array<number> | Boolean = true) {
        super(sides);
        this.type = "field";
        this.field_sides = field_sides;
        this.connected_cities = connected_cities;
    }
}

export class RoadSector extends Sector {
    inn: boolean;
    visual_sides: Array<number>;
    constructor(sides: Array<number>, vsides=[], inn=false) {
        super(sides);
        this.visual_sides = vsides;
        this.inn = inn;
        this.type = "road";
    }
}

export type Location = {
    x: number;
    y: number;
    rotations: Array<number>;
}