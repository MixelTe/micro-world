import { randomInt, randomIntFrom, circlesIntersect, circlePointIntersect } from "./functions.js";
import { MicroWorld_leaves } from "./leavesClass.js";
import { MicroWorld_cell } from "./cell.js";
import { MicroWorld_leaves_Simple } from "./leaves.js";
import { WorldCreature, Circle, Point } from "../interfaces.js";
import { MicroWorld_Cell_Simple, MicroWorld_Cell_CellEating } from "./cells.js";

export class MicroWorld_world
{
	private readonly leaves: MicroWorld_leaves[] = [];
	private readonly leavesMap: Map<string, MicroWorld_leaves[]> = new Map();
	private readonly cells: MicroWorld_cell[] = [];
	private readonly cellsMap: Map<string, MicroWorld_cell[]> = new Map();
	private readonly worldGrid = 150;
	public readonly width: number;
	public readonly height: number;
	public readonly viscosity = 0.1;
	private worldAge = 0;
	public get WorldAge()
	{
		return Math.floor(this.worldAge / 10);
	}
	public get CellsCount()
	{
		return this.cells.length;
	}

	constructor(width: number, height: number)
	{
		this.width = width;
		this.height = height;
	}

	public drawAll(ctx: CanvasRenderingContext2D)
	{
		for (let i = 0; i < this.leaves.length; i++) {
			this.leaves[i].draw(ctx, i);
		}
		// this.leaves.forEach(el =>
		// {
		// 	el.draw(ctx);
		// });
		this.cells.forEach(el =>
		{
			el.draw(ctx);
		});
		// this.drawWorldGrid(ctx);

		ctx.save();
		ctx.translate(0, this.height)
		ctx.scale(1, -1);
		ctx.fillStyle = "red";
		ctx.font = "30px Arial";
		ctx.fillText(`${Math.floor(this.worldAge / 10)}`, 10, 30);
		ctx.restore();
	}
	private drawWorldGrid(ctx: CanvasRenderingContext2D)
	{
		ctx.beginPath();
		for (let i = 0; i < Math.ceil(this.width / this.worldGrid); i++)
		{
			ctx.moveTo(this.worldGrid * i, 0)
			ctx.lineTo(this.worldGrid * i, this.height)
		}
		for (let i = 0; i < Math.ceil(this.height / this.worldGrid); i++)
		{
			ctx.moveTo(0, this.worldGrid * i)
			ctx.lineTo(this.width, this.worldGrid * i)
		}
		ctx.stroke();
	}
	public calculateAll()
	{
		const time = Date.now();
		for (let i = 0; i < 10; i++) {
			this.calculateOne_New(this.cells, this.cellsMap);
			this.calculateOne_New(this.leaves, this.leavesMap);
			if (this.leaves.length != 0 || this.cells.length != 0)
				this.worldAge += 1;
		}
		console.log("time: " + (Date.now() - time) + ", leaves: " + this.leaves.length + ", speed: " + Math.floor(this.leaves.length / (Date.now() - time)));
	}
	private calculateOne_New(elements: WorldCreature[], map: Map<string, WorldCreature[]>)
	{
		map.clear();
		for (const el of elements) {
			this.setToMap(map, el);
		}
		const toRemove: WorldCreature[] = [];
		for (const el of elements)
		{
			if (el.calculate(this)) toRemove.push(el);
		};
		for (const el of toRemove)
		{
			const index = elements.indexOf(el);
			if (index >= 0) elements.splice(index, 1);
			else throw new Error("element not found");
		};
	}
	private calculateOne(elements: WorldCreature[])
	{
		const toRemove: WorldCreature[] = [];
		for (const el of elements) {
			if (el.calculate(this)) toRemove.push(el);
		}
		for (const el of toRemove) {
			const index = elements.indexOf(el);
			if (index >= 0) elements.splice(index, 1);
			else throw new Error("element not found");
		}
	}
	private setToMap(map: Map<string, WorldCreature[]>, el: WorldCreature)
	{
		const pos = el.getPosition();
		const x = Math.floor(pos.x / this.worldGrid);
		const y = Math.floor(pos.y / this.worldGrid);
		const key = `${x}_${y}`
		let gridCell = map.get(key);
		if (gridCell == undefined)
		{
			gridCell = [];
			map.set(key, gridCell);
		}
		gridCell.push(el);
	}
	private getFromMap(map: Map<string, WorldCreature[]>, pos: Point)
	{
		const X = Math.floor(pos.x / this.worldGrid);
		const Y = Math.floor(pos.y / this.worldGrid);
		const gridZone: WorldCreature[][] = [];
		for (let y = -1; y <= 1; y++) {
			for (let x = -1; x <= 1; x++)
			{
				gridZone.push(this.getGridCell(map, X + x, Y + y));
			}
		}
		return gridZone;
	}
	private getGridCell(map: Map<string, WorldCreature[]>, x: number, y: number)
	{
		const key = `${x}_${y}`
		let gridCell = map.get(key);
		if (gridCell == undefined) return [];
		return gridCell;
	}

	public generateLeaves()
	{
		const density = 0.2 / (this.worldGrid * this.worldGrid);
		const cellCount = Math.round(this.width * this.height * density);
		const min = cellCount;
		const max = cellCount * 2;
		for (let i = 0; i < randomIntFrom(min, max); i++)
		{
			this.leaves.push(new MicroWorld_leaves_Simple(randomInt(this.width), randomInt(this.height)));
		}
		return min;
		// this.leaves.push(new MicroWorld_leaves_Simple(450, 200))
		// return 1
	}
	public generateCells()
	{
		const density = 0.1 / (this.worldGrid * this.worldGrid);
		const cellCount = Math.round(this.width * this.height * density);
		const min = cellCount;
		const max = cellCount * 2;
		for (let i = 0; i < randomIntFrom(min, max); i++)
		{
			this.cells.push(new MicroWorld_Cell_Simple(randomInt(this.width), randomInt(this.height)));
		}
	}
	public generateCells2()
	{
		const density = 0.1 / (this.worldGrid * this.worldGrid);
		const cellCount = Math.round(this.width * this.height * density);
		const min = cellCount;
		const max = cellCount * 2;
		for (let i = 0; i < randomIntFrom(min, max); i++)
		{
			this.cells.push(new MicroWorld_Cell_CellEating(randomInt(this.width), randomInt(this.height)));
		}
	}
	public createLeaves(x: number, y: number, food: number)
	{
		this.leaves.push(new MicroWorld_leaves_Simple(x, y, food, true));
	}
	// public createCell_Simple(x: number, y: number, food: number)
	// {
	// 	this.cells.push(new MicroWorld_Cell_Simple(x, y, food));
	// }
	public addCell(cell: MicroWorld_cell)
	{
		this.cells.push(cell);
	}

	public getIntersectLeaves_Count(circle: Circle)
	{
		let leavesCount = 0;
		const gridCells = <MicroWorld_leaves[][]>this.getFromMap(this.leavesMap, circle);
		for (let i = 0; i < gridCells.length; i++) {
			const el = gridCells[i];
			for (let o = 0; o < el.length; o++)
			{
				const leaves = el[o];
				if (circlesIntersect(circle, leaves.getCircle()))
				{
					leavesCount += 1;
				}
			}
		}
		return leavesCount;
	}
	public getIntersectLeaves_First(circle: Circle)
	{
		const gridCells = <MicroWorld_leaves[][]>this.getFromMap(this.leavesMap, circle);
		for (let i = 0; i < gridCells.length; i++) {
			const el = gridCells[i];
			for (let o = 0; o < el.length; o++)
			{
				const leaves = el[o];
				if (circlesIntersect(circle, leaves.getCircle()))
				{
					return leaves;
				}
			}
		}
	}
	public getIntersectLeaves_Random(circle: Circle)
	{
		const gridCells = <MicroWorld_leaves[][]>this.getFromMap(this.leavesMap, circle);
		const rightLeaves = [];
		for (let i = 0; i < gridCells.length; i++) {
			const el = gridCells[i];
			for (let o = 0; o < el.length; o++)
			{
				const leaves = el[o];
				if (circlesIntersect(circle, leaves.getCircle()))
				{
					rightLeaves.push(leaves);
				}
			}
		}
		return rightLeaves[randomInt(rightLeaves.length)];
	}
	public getIntersectLeaves_LargerRadius_Count(circle: Circle)
	{

		let leavesCount = 0;
		const gridCells = <MicroWorld_leaves[][]>this.getFromMap(this.leavesMap, circle);
		for (let i = 0; i < gridCells.length; i++) {
			const el = gridCells[i];
			for (let o = 0; o < el.length; o++)
			{
				const leaves = el[o];
				const leavesCircle = leaves.getCircle();
				if (leavesCircle.r > circle.r && circlePointIntersect(leavesCircle, circle))
				{
					leavesCount += 1;
				}
			}
		}
		return leavesCount;
	}

	public getIntersectCell_Random(circle: Circle, condition: (cell: MicroWorld_cell) => boolean = () => {return true})
	{
		const gridCells = <MicroWorld_cell[][]>this.getFromMap(this.cellsMap, circle);
		const rightEls = [];
		for (let i = 0; i < gridCells.length; i++) {
			const gridCell = gridCells[i];
			for (let o = 0; o < gridCell.length; o++)
			{
				const el = gridCell[o];
				if (circlesIntersect(circle, el.getCircle()) && condition(el))
				{
					rightEls.push(el);
				}
			}
		}
		return rightEls[randomInt(rightEls.length)];
	}
	public getIntersectCell_First(circle: Circle, condition: (cell: MicroWorld_cell) => boolean = () => {return true})
	{
		const gridCells = <MicroWorld_cell[][]>this.getFromMap(this.cellsMap, circle);
		for (let i = 0; i < gridCells.length; i++) {
			const gridCell = gridCells[i];
			for (let o = 0; o < gridCell.length; o++)
			{
				const el = gridCell[o];
				if (circlesIntersect(circle, el.getCircle()) && condition(el))
				{
					return el;
				}
			}
		}
	}
}
