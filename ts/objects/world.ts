import { randomInt, randomIntFrom, circlesIntersect, circlePointIntersect } from "./functions.js";
import { MicroWorld_leaves } from "./leavesClass.js";
import { MicroWorld_cell } from "./cell.js";
import { MicroWorld_leaves_Simple } from "./leaves.js";
import { worldCreature, Circle, Point } from "../interfaces.js";
import { MicroWorld_Cell_Simple } from "./cells.js";

type Leaves = { key: string | undefined, el: MicroWorld_leaves };
type Creature = { key: string | undefined, el: worldCreature };

export class MicroWorld_world
{
	private readonly leaves: Leaves[] = [];
	private readonly leavesMap: Map<string, Leaves[]> = new Map();
	private readonly cells: MicroWorld_cell[] = [];
	private readonly worldGrid = 150;
	public readonly width: number;
	public readonly height: number;
	public readonly viscosity = 0.1;

	constructor(width: number, height: number)
	{
		this.width = width;
		this.height = height;
	}

	public drawAll(ctx: CanvasRenderingContext2D)
	{
		for (let i = 0; i < this.leaves.length; i++) {
			this.leaves[i].el.draw(ctx, i);
		}
		// this.leaves.forEach(el =>
		// {
		// 	el.draw(ctx);
		// });
		this.cells.forEach(el =>
		{
			el.draw(ctx);
		});
		this.drawWorldGrid(ctx);
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
			this.calculateOne(this.cells);
			this.calculateOne_New(this.leaves, this.leavesMap);
		}
		console.log("time: " + (Date.now() - time) + ", leaves: " + this.leaves.length + ", speed: " + Math.floor(this.leaves.length / (Date.now() - time)));
	}
	private calculateOne_New(elements: Creature[], map: Map<string, Creature[]>)
	{
		const toRemove: Creature[] = [];
		elements.forEach(el =>
		{
			if (el.el.calculate(this)) toRemove.push(el);
			else this.setToMap(map, el);
		});
		toRemove.forEach(el => {
			const index = elements.indexOf(el);
			if (index < 0) throw new Error("element not found");
			else
			{
				elements.splice(index, 1);
				if (el.key != undefined)
				{
					const gridCell = map.get(el.key)
					if (gridCell != undefined)
					{
						const index = gridCell.indexOf(el);
						if (index < 0) throw new Error("element not found");
						gridCell.splice(index, 1);
					}
				}
			}
		});
	}
	private calculateOne(elements: worldCreature[])
	{
		const toRemove: worldCreature[] = [];
		elements.forEach(el =>
		{
			if (el.calculate(this)) toRemove.push(el);
		});
		toRemove.forEach(el => {
			const index = elements.indexOf(el);
			if (index >= 0) elements.splice(index, 1);
			else throw new Error("element not found");
		});
	}
	private setToMap(map: Map<string, Creature[]>, el: Creature)
	{
		const pos = el.el.getPosition();
		const x = Math.floor(pos.x / this.worldGrid);
		const y = Math.floor(pos.y / this.worldGrid);
		const key = `${x}_${y}`
		let gridCell = map.get(key);
		if (gridCell == undefined)
		{
			gridCell = [];
			map.set(key, gridCell);
		}
		const index = gridCell.indexOf(el);
		if (index < 0)
		{
			el.key = key;
			gridCell.push(el);
		}
	}
	private getFromMap(map: Map<string, Creature[]>, pos: Point)
	{
		const X = Math.floor(pos.x / this.worldGrid);
		const Y = Math.floor(pos.y / this.worldGrid);
		const gridZone: Creature[][] = [];
		for (let y = -1; y <= 1; y++) {
			for (let x = -1; x <= 1; x++)
			{
				gridZone.push(this.getGridCell(map, X + x, Y + y));
			}
		}
		return gridZone;
	}
	private getGridCell(map: Map<string, Creature[]>, x: number, y: number)
	{
		const key = `${x}_${y}`
		let gridCell = map.get(key);
		if (gridCell == undefined) return [];
		return gridCell;
	}

	public generateLeaves()
	{
		const density = 0.5 / (this.worldGrid * this.worldGrid);
		const cellCount = Math.round(this.width * this.height * density);
		const min = cellCount;
		const max = cellCount * 2;
		for (let i = 0; i < randomIntFrom(min, max); i++)
		{
			this.leaves.push({key: undefined, el: new MicroWorld_leaves_Simple(randomInt(this.width), randomInt(this.height))});
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
	public createLeaves(x: number, y: number, food: number)
	{
		this.leaves.push({ key: undefined, el: new MicroWorld_leaves_Simple(x, y, food, true) });
	}
	public createCell_Simple(x: number, y: number, food: number)
	{
		this.cells.push(new MicroWorld_Cell_Simple(x, y, food));
	}
	public getIntersectLeaves_Count(circle: Circle)
	{
		let leavesCount = 0;
		const gridCells = <Leaves[][]>this.getFromMap(this.leavesMap, circle);
		for (let i = 0; i < gridCells.length; i++) {
			const el = gridCells[i];
			for (let o = 0; o < el.length; o++)
			{
				const leaves = el[o];
				if (circlesIntersect(circle, leaves.el.getCircle()))
				{
					leavesCount += 1;
				}
			}
		}
		return leavesCount;
	}
	public getIntersectLeaves_First(circle: Circle)
	{
		const gridCells = <Leaves[][]>this.getFromMap(this.leavesMap, circle);
		for (let i = 0; i < gridCells.length; i++) {
			const el = gridCells[i];
			for (let o = 0; o < el.length; o++)
			{
				const leaves = el[o];
				if (circlesIntersect(circle, leaves.el.getCircle()))
				{
					return leaves.el;
				}
			}
		}
	}
	public getIntersectLeaves_LargerRadius_Count(circle: Circle)
	{

		let leavesCount = 0;
		const gridCells = <Leaves[][]>this.getFromMap(this.leavesMap, circle);
		for (let i = 0; i < gridCells.length; i++) {
			const el = gridCells[i];
			for (let o = 0; o < el.length; o++)
			{
				const leaves = el[o];
				const leavesCircle = leaves.el.getCircle();
				if (leavesCircle.r > circle.r && circlePointIntersect(leavesCircle, circle))
				{
					leavesCount += 1;
				}
			}
		}
		return leavesCount;
	}
}
