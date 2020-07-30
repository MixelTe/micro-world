import { bounceOnEdge } from "./functions.js";
export class MicroWorld_cell {
    constructor(x, y, food) {
        this.Type_speed = { normal: 6 };
        this.Type_viewRange = { normal: 70 };
        this.Type_food = { normal: 10 };
        this.Type_foodCooldown = { normal: 30 };
        this.Type_hunger = { normal: 1 };
        this.Type_calculate = { normal: this.calculateNormal };
        this.Type_foodType = { leaves: 1 };
        this.Type_multiplyAge = { normal: 1000 };
        this.Type_growTime = { normal: 500 };
        this.Type_state = { dead: 0, moving: 1, eating: 2 };
        this.color = "lightGreen";
        this.state = this.Type_state.moving;
        this.eatRangeMul = 1.5;
        this.cellSize = 10;
        this.cellSizeMin = 2;
        this.firstStart = true;
        this.remove = false;
        this.moveAngle = 0;
        this.speedCur = 0;
        this.moveSpeedCur = 0;
        this.foodCD = 0;
        this.foodCur = 0;
        this.cellAlpha = 1;
        this.eatRangeCur = () => { return this.cellSizeCur * this.eatRangeMul; };
        this.viewRangeCur = 0;
        this.cellSizeCur = 2;
        this.age = 0;
        this.x = x;
        this.y = y;
        this.startFood = food;
    }
    getPosition() {
        return { x: this.x, y: this.y };
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.cellAlpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.cellSizeCur, 0, 2 * Math.PI);
        ctx.fill();
        if (this.age >= this.multiplyAge) {
            ctx.save();
            ctx.globalAlpha = this.cellAlpha;
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.cellSizeCur * 0.8, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        }
        if (true) {
            ctx.save();
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.viewRangeCur, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.eatRangeCur(), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(1, -1);
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText(`${this.foodCur}`, 0, -30);
            ctx.restore();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(1, -1);
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText(`${Math.floor(this.age / 10)}`, 0, 30);
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
    onStart() {
        this.moveSpeedCur = this.moveSpeed;
        if (this.startFood == undefined)
            this.foodCur = this.food;
        else
            this.foodCur = this.startFood;
        this.viewRangeCur = this.viewRange;
        this.firstStart = false;
    }
    calculateNormal(world) {
        if (this.firstStart)
            this.onStart();
        this.foodCD = Math.max(this.foodCD - 1, 0);
        switch (this.state) {
            case this.Type_state.moving:
                this.ageNormal(world);
                this.moveCellNormal(world);
                this.multiplyNormal(world);
                break;
            case this.Type_state.eating:
                this.ageNormal(world);
                this.eatNormal(world);
                break;
            case this.Type_state.dead:
                this.deadNormal(world);
                break;
        }
        return this.remove;
    }
    moveCell(world) {
        const dx = this.speedCur * Math.cos(this.moveAngle);
        const dy = this.speedCur * Math.sin(this.moveAngle);
        const XYA = bounceOnEdge(this.moveAngle, this.x + dx, this.y + dy, world.width, world.height);
        this.x = XYA.newX;
        this.y = XYA.newY;
        this.moveAngle = XYA.angle;
    }
    moveCellNormal(world) {
        if (this.foodCur >= 0) {
            if (this.speedCur <= 0) {
                if (this.foodCur > 0) {
                    this.moveAngle = this.turnToLeaves(world);
                    this.speedCur = this.moveSpeedCur;
                }
                this.foodCur -= this.hunger;
            }
            else {
                this.speedCur -= world.viscosity;
            }
            this.moveCell(world);
            if (this.leavesIntersect(world).intersect) {
                this.state = this.Type_state.eating;
            }
        }
        else {
            this.state = this.Type_state.dead;
        }
    }
    turnToLeaves(world) {
        const leaves = world.getIntersectLeaves_Random({ x: this.x, y: this.y, r: this.viewRangeCur });
        if (leaves != undefined) {
            const pos = leaves.getCircle();
            return Math.atan2(pos.y - this.y, pos.x - this.x);
        }
        return Math.random() * Math.PI * 2;
        // return 20 / 180 * Math.PI;
    }
    leavesIntersect(world) {
        const leaves = world.getIntersectLeaves_First({ x: this.x, y: this.y, r: this.eatRangeCur() });
        if (leaves != undefined) {
            return { intersect: true, obj: leaves };
        }
        return { intersect: false };
        ;
    }
    eatNormal(world) {
        if (this.speedCur > 0) {
            this.speedCur = Math.max(this.speedCur - this.eatRangeCur() / 10, 0);
        }
        else {
            this.speedCur = 0;
            const intersection = this.leavesIntersect(world);
            if (intersection.intersect && intersection.obj != undefined) {
                if (this.foodCD == 0) {
                    this.foodCur += intersection.obj.getSomeFood(world);
                    this.foodCD = this.foodCooldown;
                }
            }
            else {
                this.state = this.Type_state.moving;
            }
        }
        this.moveCell(world);
    }
    deadNormal(world) {
        this.color = "black";
        this.cellAlpha = Math.max(this.cellAlpha - 0.01, 0);
        if (this.cellAlpha == 0)
            this.remove = true;
    }
    ageNormal(world) {
        this.age += 1;
        if (this.cellSizeCur != this.cellSize) {
            const growStep = (this.cellSize - this.cellSizeMin) / this.growTime;
            this.cellSizeCur = Math.min(this.cellSizeCur + growStep, this.cellSize);
            const ageMultiply = (this.cellSizeCur / this.cellSize);
            this.viewRangeCur = this.viewRange * ageMultiply;
            this.moveSpeedCur = this.moveSpeed * Math.min(ageMultiply * 2, 1);
        }
    }
    multiplyNormal(world) {
        if (this.age >= this.multiplyAge) {
            let children = 0;
            const foodForChild = this.food * 1.5;
            for (let i = 10; i >= 0; i--) {
                if (this.foodCur / i >= this.food + foodForChild) {
                    children = i;
                    break;
                }
            }
            if (children > 1) {
                const childFood = Math.floor((this.foodCur - foodForChild * children) / children);
                for (let i = 0; i < children; i++) {
                    this.createChild(this.x, this.y, childFood, world);
                }
                this.remove = true;
            }
        }
    }
}
