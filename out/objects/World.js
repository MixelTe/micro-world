import { randomInt, randomIntFrom, circlesIntersect, circlePointIntersect } from "./functions.js";
import { MicroWorld_leaves_Simple } from "./leaves.js";
import { MicroWorld_Cell_Simple } from "./cells.js";
export class MicroWorld_world {
    constructor(width, height) {
        this.leaves = [];
        this.leavesMap = new Map();
        this.cells = [];
        this.worldGrid = 150;
        this.viscosity = 0.1;
        this.worldAge = 0;
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
        // this.drawWorldGrid(ctx);
        ctx.save();
        ctx.translate(0, this.height);
        ctx.scale(1, -1);
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText(`${Math.floor(this.worldAge / 10)}`, 10, 30);
        ctx.restore();
    }
    drawWorldGrid(ctx) {
        ctx.beginPath();
        for (let i = 0; i < Math.ceil(this.width / this.worldGrid); i++) {
            ctx.moveTo(this.worldGrid * i, 0);
            ctx.lineTo(this.worldGrid * i, this.height);
        }
        for (let i = 0; i < Math.ceil(this.height / this.worldGrid); i++) {
            ctx.moveTo(0, this.worldGrid * i);
            ctx.lineTo(this.width, this.worldGrid * i);
        }
        ctx.stroke();
    }
    calculateAll() {
        const time = Date.now();
        for (let i = 0; i < 1; i++) {
            this.calculateOne(this.cells);
            this.calculateOne_New(this.leaves, this.leavesMap);
            if (this.leaves.length != 0 || this.cells.length != 0)
                this.worldAge += 1;
        }
        console.log("time: " + (Date.now() - time) + ", leaves: " + this.leaves.length + ", speed: " + Math.floor(this.leaves.length / (Date.now() - time)));
    }
    calculateOne_New(elements, map) {
        map.clear();
        for (const el of elements) {
            this.setToMap(map, el);
        }
        const toRemove = [];
        for (const el of elements) {
            if (el.calculate(this))
                toRemove.push(el);
        }
        ;
        for (const el of toRemove) {
            const index = elements.indexOf(el);
            if (index >= 0)
                elements.splice(index, 1);
            else
                throw new Error("element not found");
        }
        ;
    }
    calculateOne(elements) {
        const toRemove = [];
        for (const el of elements) {
            if (el.calculate(this))
                toRemove.push(el);
        }
        for (const el of toRemove) {
            const index = elements.indexOf(el);
            if (index >= 0)
                elements.splice(index, 1);
            else
                throw new Error("element not found");
        }
    }
    setToMap(map, el) {
        const pos = el.getPosition();
        const x = Math.floor(pos.x / this.worldGrid);
        const y = Math.floor(pos.y / this.worldGrid);
        const key = `${x}_${y}`;
        let gridCell = map.get(key);
        if (gridCell == undefined) {
            gridCell = [];
            map.set(key, gridCell);
        }
        gridCell.push(el);
    }
    getFromMap(map, pos) {
        const X = Math.floor(pos.x / this.worldGrid);
        const Y = Math.floor(pos.y / this.worldGrid);
        const gridZone = [];
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                gridZone.push(this.getGridCell(map, X + x, Y + y));
            }
        }
        return gridZone;
    }
    getGridCell(map, x, y) {
        const key = `${x}_${y}`;
        let gridCell = map.get(key);
        if (gridCell == undefined)
            return [];
        return gridCell;
    }
    generateLeaves() {
        const density = 0.2 / (this.worldGrid * this.worldGrid);
        const cellCount = Math.round(this.width * this.height * density);
        const min = cellCount;
        const max = cellCount * 2;
        for (let i = 0; i < randomIntFrom(min, max); i++) {
            this.leaves.push(new MicroWorld_leaves_Simple(randomInt(this.width), randomInt(this.height)));
        }
        return min;
        // this.leaves.push(new MicroWorld_leaves_Simple(450, 200))
        // return 1
    }
    generateCells() {
        const density = 0.1 / (this.worldGrid * this.worldGrid);
        const cellCount = Math.round(this.width * this.height * density);
        const min = cellCount;
        const max = cellCount * 2;
        for (let i = 0; i < randomIntFrom(min, max); i++) {
            this.cells.push(new MicroWorld_Cell_Simple(randomInt(this.width), randomInt(this.height)));
        }
    }
    createLeaves(x, y, food) {
        this.leaves.push(new MicroWorld_leaves_Simple(x, y, food, true));
    }
    createCell_Simple(x, y, food) {
        this.cells.push(new MicroWorld_Cell_Simple(x, y, food));
    }
    getIntersectLeaves_Count(circle) {
        let leavesCount = 0;
        const gridCells = this.getFromMap(this.leavesMap, circle);
        for (let i = 0; i < gridCells.length; i++) {
            const el = gridCells[i];
            for (let o = 0; o < el.length; o++) {
                const leaves = el[o];
                if (circlesIntersect(circle, leaves.getCircle())) {
                    leavesCount += 1;
                }
            }
        }
        return leavesCount;
    }
    getIntersectLeaves_First(circle) {
        const gridCells = this.getFromMap(this.leavesMap, circle);
        for (let i = 0; i < gridCells.length; i++) {
            const el = gridCells[i];
            for (let o = 0; o < el.length; o++) {
                const leaves = el[o];
                if (circlesIntersect(circle, leaves.getCircle())) {
                    return leaves;
                }
            }
        }
    }
    getIntersectLeaves_Random(circle) {
        const gridCells = this.getFromMap(this.leavesMap, circle);
        const rightLeaves = [];
        for (let i = 0; i < gridCells.length; i++) {
            const el = gridCells[i];
            for (let o = 0; o < el.length; o++) {
                const leaves = el[o];
                if (circlesIntersect(circle, leaves.getCircle())) {
                    rightLeaves.push(leaves);
                }
            }
        }
        return rightLeaves[randomInt(rightLeaves.length)];
    }
    getIntersectLeaves_LargerRadius_Count(circle) {
        let leavesCount = 0;
        const gridCells = this.getFromMap(this.leavesMap, circle);
        for (let i = 0; i < gridCells.length; i++) {
            const el = gridCells[i];
            for (let o = 0; o < el.length; o++) {
                const leaves = el[o];
                const leavesCircle = leaves.getCircle();
                if (leavesCircle.r > circle.r && circlePointIntersect(leavesCircle, circle)) {
                    leavesCount += 1;
                }
            }
        }
        return leavesCount;
    }
}
