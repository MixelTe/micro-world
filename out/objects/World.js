import { randomInt, randomIntFrom } from "./functions.js";
import { MicroWorld_leaves } from "./leaves.js";
export class MicroWorld_world {
    constructor(width, height) {
        this.leaves = [];
        this.cells = [];
        this.viscosity = 0.1;
        this.width = width;
        this.height = height;
    }
    drawAll(ctx) {
        for (let i = 0; i < this.leaves.length; i++) {
            this.leaves[i].draw(ctx, i);
        }
        // this.leaves.forEach(el =>
        // {
        // 	el.draw(ctx);
        // });
        this.cells.forEach(el => {
            el.draw(ctx);
        });
    }
    calculateAll() {
        this.cells.forEach(el => {
            el.movement(this);
        });
    }
    generateLeaves() {
        const density = 0.5 / (200 * 200);
        const cellCount = Math.round(this.width * this.height * density);
        const min = cellCount;
        const max = cellCount * 2;
        for (let i = 0; i < randomIntFrom(min, max); i++) {
            this.leaves.push(new MicroWorld_leaves(randomInt(this.width), randomInt(this.height)));
        }
        return min;
        // this.objects.push(new MicroWorld_leaves(50, 50))
    }
}
