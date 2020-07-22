import { randomIntFrom } from "./functions.js";
export class MicroWorld_leaves {
    constructor(x, y) {
        this.color = "green";
        this.x = 10;
        this.y = 10;
        this.food = randomIntFrom(2, 7);
        this.x = x;
        this.y = y;
    }
    getPosition() {
        return { x: this.x, y: this.y };
    }
    draw(ctx, i) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.food * 2, 0, 2 * Math.PI);
        ctx.fill();
        // ctx.fillStyle = "black";
        // ctx.fillText(`${i}`, this.x, this.y);
        // ctx.restore();
    }
    getSomeFood(world) {
        this.food -= 1;
        if (this.food <= 0) {
            const index = world.leaves.indexOf(this);
            world.leaves.splice(index, 1);
        }
        return 1;
    }
}
