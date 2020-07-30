import { MicroWorld_leaves } from "./leavesClass.js";
export class MicroWorld_leaves_Simple extends MicroWorld_leaves {
    constructor(x, y, food, move) {
        super(x, y, food, move);
        this.calculate = this.Type_calculate.normal;
        this.growSpeed = this.Type_growSpeed.normal;
        this.growMax = this.Type_growMax.normal;
        this.spreadRadius = this.Type_spreadRadius.normal;
    }
}
