import { circlePointIntersect } from "./functions.js";
export class MicroWorld_cell {
    constructor(x, y) {
        this.Type_speed = { normal: 6 };
        this.Type_viewRange = { normal: 70 };
        this.Type_food = { normal: 10 };
        this.Type_hunger = { normal: 1 };
        this.Type_movement = { normal: this.movementNormal };
        this.Type_foodType = { leaves: 1 };
        this.Type_state = { moving: 1, eating: 2 };
        this.color = "lightGreen";
        this.state = this.Type_state.moving;
        this.eatRange = 20;
        this.moveAngle = 0;
        this.curSpeed = 0;
        this.x = x;
        this.y = y;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        if (true) {
            ctx.save();
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.viewRange, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.eatRange, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(1, -1);
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText(`${this.food}`, 0, -30);
            ctx.restore();
            ctx.restore();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.moveAngle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(100, 0);
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
    }
    movementNormal(world) {
        switch (this.state) {
            case this.Type_state.moving:
                this.moveCellNormal(world);
                break;
            case this.Type_state.eating:
                this.eatNormal(world);
                break;
        }
    }
    moveCell(world) {
        const dx = this.curSpeed * Math.cos(this.moveAngle);
        const dy = this.curSpeed * Math.sin(this.moveAngle);
        const XY = this.bounceOnEdge(dx, dy, world.width, world.height);
        this.x = XY.newX;
        this.y = XY.newY;
    }
    bounceOnEdge(dx, dy, width, height) {
        let newX = this.x + dx;
        let newY = this.y + dy;
        if (newX > width) {
            newX = width - (newX - width);
        }
        if (newX < 0) {
            newX = -newX;
        }
        if (newY > height) {
            newY = height - (newY - height);
        }
        if (newY < 0) {
            newY = -newY;
        }
        if (newX != this.x + dx)
            this.moveAngle += Math.PI / 2;
        if (newY != this.y + dy)
            this.moveAngle = -this.moveAngle;
        return { newX, newY };
    }
    moveCellNormal(world) {
        if (this.food >= 0) {
            if (this.curSpeed <= 0) {
                if (this.food > 0) {
                    this.moveAngle = this.turnToLeaves(world);
                    this.curSpeed = this.speed;
                }
                this.food -= this.hunger;
            }
            else {
                this.curSpeed -= world.viscosity;
            }
            this.moveCell(world);
            if (this.leavesIntersect(world).intersect) {
                this.state = this.Type_state.eating;
            }
        }
        else {
            this.color = "black";
        }
    }
    turnToLeaves(world) {
        for (let i = 0; i < world.leaves.length; i++) {
            const el = world.leaves[i];
            const pos = el.getPosition();
            const angle = Math.atan2(pos.y - this.y, pos.x - this.x);
            if (circlePointIntersect(this.x, this.y, this.viewRange, pos.x, pos.y)) {
                return angle;
            }
        }
        return Math.random() * Math.PI * 2;
        // return 20 / 180 * Math.PI;
    }
    leavesIntersect(world) {
        for (let i = 0; i < world.leaves.length; i++) {
            const el = world.leaves[i];
            const pos = el.getPosition();
            if (circlePointIntersect(this.x, this.y, this.eatRange, pos.x, pos.y))
                return { intersect: true, obj: el };
        }
        return { intersect: false };
        ;
    }
    eatNormal(world) {
        if (this.curSpeed > 0) {
            this.curSpeed -= 0.5;
        }
        else {
            this.curSpeed = 0;
            const intersection = this.leavesIntersect(world);
            if (intersection.intersect && intersection.obj != undefined) {
                this.food += intersection.obj.getSomeFood(world);
            }
            else {
                this.state = this.Type_state.moving;
            }
        }
        this.moveCell(world);
    }
}
