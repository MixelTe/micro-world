import { randomIntFrom, bounceOnEdge, circlePointIntersect } from "./functions.js";
import { MicroWorld_world } from "./World.js";

export abstract class MicroWorld_leaves
{
	protected readonly Type_calculate = { normal: this.growNormal };
	protected readonly Type_growSpeed = { normal: 70 };
	protected readonly Type_growMax = { normal: 10 };
	protected readonly Type_spreadRadius = { normal: 80 };

	public abstract calculate: (world: MicroWorld_world) => boolean;
	protected abstract growSpeed: number;
	protected abstract growMax: number;
	protected abstract spreadRadius: number;
	private color = "green";
	private x: number;
	private y: number;
	private movement = { active: false, angle: 0, speed: 0, acc: 0, first: true };
	private growSpeedCur = 0;
	private food = randomIntFrom(2, 7);
	private remove = false;
	private growCD = 0;

	constructor(x: number, y: number, food?: number, move?: boolean)
	{
		this.x = x;
		this.y = y;
		if (food != undefined) this.food = food;
		this.movement.active = move || false;
	}

	private growNormal(world: MicroWorld_world)
	{
		this.growCD = Math.max(this.growCD - 1, 0);
		let leavesAround = 1;
		for (let i = 0; i < world.leaves.length; i++)
		{
			const el = world.leaves[i];
			const pos = el.getPosition();
			if (circlePointIntersect(this.x, this.y, this.food * 5, pos.x, pos.y))
			{
				leavesAround += 1;
			}
		}
		this.growSpeedCur = this.growSpeed * leavesAround;

		if (this.growCD == 0)
		{
			this.food = Math.min(this.food + 0.5, this.growMax);
			this.growCD = this.growSpeedCur;
		}
		if (this.food == this.growMax)
		{
			let children = 0;
			const minfood = 1;
			const foodForChild = 2;
			for (let i = 10; i >= 0; i--)
			{
				if (this.food / i >= minfood + foodForChild)
				{
					children = i;
					break;
				}
			}
			const childFood = Math.floor((this.food - foodForChild * children) / children);
			for (let i = 0; i < children - 1; i++)
			{
				world.Leaves_createLeaves(this.x, this.y, childFood - 1);
			}
			this.food = childFood;
		}
		if (this.movement.active) this.move(world);
		return this.remove;
	}
	private move(world: MicroWorld_world)
	{
		if (this.movement.first)
		{
			this.movement.angle = Math.random() * Math.PI * 2;
			this.movement.speed = this.spreadRadius * 0.135;
			this.movement.acc = this.spreadRadius * 0.01;
			this.movement.first = false;
		}
		const dx = this.movement.speed * Math.cos(this.movement.angle);
		const dy = this.movement.speed * Math.sin(this.movement.angle);

		const XY = bounceOnEdge(this.movement.angle, this.x + dx, this.y + dy, world.width, world.height);
		this.x = XY.newX;
		this.y = XY.newY;
		this.movement.speed = Math.max(this.movement.speed - this.movement.acc, 0);
		if (this.movement.speed == 0) this.movement.active = false;
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
		ctx.arc(this.x, this.y, this.food * 2, 0, 2 * Math.PI);
		ctx.fill();

		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.food * 5, 0, 2 * Math.PI);
		// ctx.stroke();
		// ctx.fillStyle = "black";
		// ctx.fillText(`${i}`, this.x, this.y);
		ctx.restore();
	}

	public getSomeFood(world: MicroWorld_world)
	{
		this.food -= 1;
		if (this.food <= 0) this.remove = true;
		return 1;
	}
}