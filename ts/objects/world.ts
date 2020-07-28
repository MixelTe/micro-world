import { randomInt, randomIntFrom } from "./functions.js";
import { MicroWorld_leaves } from "./leavesClass.js";
import { MicroWorld_cell } from "./cell.js";
import { MicroWorld_leaves_Simple } from "./leaves.js";
import { worldCreature } from "../interfaces.js";

export class MicroWorld_world
{
	public readonly leaves: MicroWorld_leaves[] = [];
	public readonly cells: MicroWorld_cell[] = [];
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
		for (let i = 0; i < 1; i++) {
			this.calculateOne(this.cells);
			this.calculateOne(this.leaves);
		}
	}
	private calculateOne(elements: worldCreature[])
	{
		const toRemoveLeaves: worldCreature[] = [];
		elements.forEach(el =>
		{
			if (el.calculate(this)) toRemoveLeaves.push(el);
		});
		toRemoveLeaves.forEach(el => {
			const index = elements.indexOf(el);
			if (index >= 0) elements.splice(index, 1);
			else throw new Error("element not found");
		});
	}

	public generateLeaves()
	{
		const density = 0.5 / (200 * 200);
		const cellCount = Math.round(this.width * this.height * density);
		const min = cellCount;
		const max = cellCount * 2;
		for (let i = 0; i < randomIntFrom(min, max); i++)
		{
			this.leaves.push(this.createLeaves(randomInt(this.width), randomInt(this.height)));
		}
		return min;
		// this.leaves.push(new MicroWorld_leaves_Simple(500, 200))
		// return 1
	}
	public createLeaves(x: number, y: number)
	{
		return new MicroWorld_leaves_Simple(x, y)
	}
	public Leaves_createLeaves(x: number, y: number, food: number)
	{
		this.leaves.push(new MicroWorld_leaves_Simple(x, y, food, true));
	}
}
