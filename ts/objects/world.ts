import { randomInt, randomIntFrom, circlesIntersect, circlePointIntersect } from "./functions.js";
import { MicroWorld_leaves } from "./leavesClass.js";
import { MicroWorld_cell } from "./cell.js";
import { MicroWorld_leaves_Simple } from "./leaves.js";
import { worldCreature, Circle } from "../interfaces.js";
import { MicroWorld_Cell_Simple } from "./cells.js";

export class MicroWorld_world
{
	private readonly leaves: MicroWorld_leaves[] = [];
	private readonly cells: MicroWorld_cell[] = [];
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
	}
	public calculateAll()
	{
		const time = Date.now();
		for (let i = 0; i < 10; i++) {
			this.calculateOne(this.cells);
			this.calculateOne(this.leaves);
		}
		console.log("time: " + (Date.now() - time) + ", leaves: " + this.leaves.length + ", speed: " + Math.floor(this.leaves.length / (Date.now() - time)));
	}
	private calculateOne(elements: worldCreature[])
	{
		const toRemove: worldCreature[] = [];
		for (const el of elements) {
			if (el.calculate(this)) toRemove.push(el);
		}
		for (const el of toRemove) {
			const index = elements.indexOf(el);
			if (index >= 0) elements.splice(index, 1);
			else throw new Error("element not found");
		}
	}

	public generateLeaves()
	{
		const density = 0.5 / (200 * 200);
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
		const density = 0.1 / (200 * 200);
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
		this.leaves.push(new MicroWorld_leaves_Simple(x, y, food, true));
	}
	public createCell_Simple(x: number, y: number, food: number)
	{
		this.cells.push(new MicroWorld_Cell_Simple(x, y, food));
	}
	public getIntersectLeaves_Count(circle: Circle)
	{
		let leaves = 0;
		for (let i = 0; i < this.leaves.length; i++)
		{
			const el = this.leaves[i];
			if (circlesIntersect(circle, el.getCircle()))
			{
				leaves += 1;
			}
		}
		return leaves;
	}
	public getIntersectLeaves_First(circle: Circle)
	{
		for (let i = 0; i < this.leaves.length; i++)
		{
			const el = this.leaves[i];
			if (circlesIntersect(circle, el.getCircle()))
			{
				return el;
			}
		}
	}
	public getIntersectLeaves_LargerRadius_Count(circle: Circle)
	{
		let leaves = 0;
		for (let i = 0; i < this.leaves.length; i++)
		{
			const el = this.leaves[i];
			const elCircle = el.getCircle();
			if (elCircle.r > circle.r && circlePointIntersect(elCircle, circle))
			{
				leaves += 1;
			}
		}
		return leaves;
	}
}
