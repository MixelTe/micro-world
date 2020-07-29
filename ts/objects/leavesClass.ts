import { randomIntFrom, bounceOnEdge } from "./functions.js";
import { MicroWorld_world } from "./World.js";

export abstract class MicroWorld_leaves
{
	protected readonly Type_calculate = { normal: this.growNormal };
	protected readonly Type_growSpeed = { normal: 70 };
	protected readonly Type_growMax = { normal: 10 };
	protected readonly Type_spreadRadius = { normal: 50 };

	public abstract calculate: (world: MicroWorld_world) => boolean;
	protected abstract growSpeed: number;
	protected abstract growMax: number;
	protected abstract spreadRadius: number;
	private color = "green";
	private x: number;
	private y: number;
	private r() { return this.food * 2; }
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
		const leavesAround = world.getIntersectLeaves_Count({x: this.x, y: this.y, r: this.r() * 2});
		this.growSpeedCur = this.growSpeed * (leavesAround / 2);
		const insideBigLeaves = world.getIntersectLeaves_LargerRadius_Count(this.getCircle());
		if (insideBigLeaves > 0) this.growCD = this.growSpeedCur;

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

		const XYA = bounceOnEdge(this.movement.angle, this.x + dx, this.y + dy, world.width, world.height);
		this.x = XYA.newX;
		this.y = XYA.newY;
		this.movement.angle = XYA.angle
		this.movement.speed = Math.max(this.movement.speed - this.movement.acc, 0);
		if (this.movement.speed == 0)
		{
			this.movement.active = false;
			let leavesAround = world.getIntersectLeaves_Count({ x: this.x, y: this.y, r: this.r() * 2 });
			if (leavesAround > 1) this.remove = true;
		}
	}

	public getCircle()
	{
		return { x: this.x, y: this.y, r: this.r() };
	}

	public draw(ctx: CanvasRenderingContext2D, i: number)
	{
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r(), 0, 2 * Math.PI);
		ctx.fill();

		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.r() * 2, 0, 2 * Math.PI);
		// ctx.stroke();

		// ctx.strokeStyle = "gray";
		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.spreadRadius, 0, 2 * Math.PI);
		// ctx.stroke();

		// ctx.fillStyle = "black";
		// ctx.translate(this.x, this.y);
		// ctx.scale(1, -1);
		// ctx.fillStyle = "black";
		// ctx.fillText(`${i}`, 0, 0);

		ctx.restore();
	}

	public getSomeFood(world: MicroWorld_world)
	{
		this.food -= 1;
		if (this.food <= 0) this.remove = true;
		return 1;
	}
}