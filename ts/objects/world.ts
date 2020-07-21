import { randomInt, randomIntFrom } from "./functions.js";
import { MicroWorld_leaves } from "./leaves.js";
import { MicroWorld_cell } from "./cell.js";

export class MicroWorld_world
{
	public readonly leaves: MicroWorld_leaves[] = [];
	public readonly cells: MicroWorld_cell[] = [];
	public readonly width: number;
	public readonly height: number;
	public readonly zoom: number;
	public readonly viscosity = 0.1;

	constructor(width: number, height: number, zoom = 1)
	{
		this.width = width;
		this.height = height;
		this.zoom = zoom;
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
		this.cells.forEach(el =>
		{
			el.movement(this);
		});
	}

	public generateLeaves()
	{
		const density = 1.5 / (200 * 200);
		const cellCount = Math.round(this.width * this.height / this.zoom * density);
		const min = cellCount;
		const max = cellCount * 2;
		for (let i = 0; i < randomIntFrom(min, max); i++)
		{
			this.leaves.push(new MicroWorld_leaves(randomInt(this.width), randomInt(this.height), this.zoom))
		}
		return min;
		// this.objects.push(new MicroWorld_leaves(50, 50))
	}
}
