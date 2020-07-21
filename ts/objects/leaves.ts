import { randomIntFrom } from "./functions.js";
import { MicroWorld_world } from "./World.js";

export class MicroWorld_leaves
{
	private color = "green";
	private x = 10;
	private y = 10;
	private mr = 2;
	private food = randomIntFrom(2, 7);

	constructor(x: number, y: number, zoom = 1)
	{
		this.x = x;
		this.y = y;
		this.applyZoom(zoom);
	}
	private applyZoom(zoom: number)
	{
		this.mr *= zoom;
	}


	public getPosition()
	{
		return { x: this.x, y: this.y };
	}

	public draw(ctx: CanvasRenderingContext2D, i: number)
	{
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.food * this.mr, 0, 2 * Math.PI);
		ctx.fill();
		// ctx.fillStyle = "black";
		// ctx.fillText(`${i}`, this.x, this.y);
		// ctx.restore();
	}

	public getSomeFood(world: MicroWorld_world)
	{
		this.food -= 1;
		if (this.food <= 0)
		{
			const index = world.leaves.indexOf(this);
			world.leaves.splice(index, 1);
		}
		return 1;
	}
}