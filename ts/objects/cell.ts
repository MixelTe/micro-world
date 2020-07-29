import { MicroWorld_world } from "./World.js";
import { bounceOnEdge } from "./functions.js";

export abstract class MicroWorld_cell
{
	protected readonly Type_speed = { normal: 6 };
	protected readonly Type_viewRange = { normal: 70 };
	protected readonly Type_food = { normal: 10 };
	protected readonly Type_foodCooldown = { normal: 30 };
	protected readonly Type_hunger = { normal: 1 };
	protected readonly Type_movement = { normal: this.movementNormal }
	protected readonly Type_foodType = { leaves: 1 };
	private readonly Type_state = { dead: 0, moving: 1, eating: 2 };

	protected abstract speed: number;
	protected abstract viewRange: number;
	protected abstract food: number;
	protected abstract foodCooldown: number;
	protected abstract foodType: number;
	protected abstract hunger: number;
	public abstract calculate: (world: MicroWorld_world) => boolean;
	private color = "lightGreen";
	private state = this.Type_state.moving;

	constructor(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}

	private x: number;
	private y: number;
	private removeCell = false;
	private eatRange = 20;
	private moveAngle = 0;
	private curSpeed = 0;
	private foodCD = 0;
	private cellAlpha = 1;

	public draw(ctx: CanvasRenderingContext2D)
	{
		ctx.save();
		ctx.globalAlpha = this.cellAlpha;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
		ctx.fill();

		if (true)
		{
			ctx.save();
			ctx.strokeStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.viewRange, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.eatRange, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.save();
			ctx.translate(this.x, this.y)
			ctx.scale(1, -1);
			ctx.fillStyle = "black";
			ctx.font = "30px Arial";
			ctx.fillText(`${this.food}`, 0, -30);
			ctx.restore();
			ctx.restore();

			ctx.translate(this.x, this.y)
			ctx.rotate(this.moveAngle);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(100, 0);
			ctx.stroke();
			ctx.restore();
		}

		ctx.restore();
	}

	private movementNormal(world: MicroWorld_world)
	{
		this.foodCD = Math.max(this.foodCD - 1, 0);
		switch (this.state)
		{
			case this.Type_state.moving:
				this.moveCellNormal(world);
				break;

			case this.Type_state.eating:
				this.eatNormal(world);
				break;

			case this.Type_state.dead:
				this.deadNormal(world);
				break;
		}
		return this.removeCell;
	}

	private moveCell(world: MicroWorld_world)
	{
		const dx = this.curSpeed * Math.cos(this.moveAngle);
		const dy = this.curSpeed * Math.sin(this.moveAngle);

		const XYA = bounceOnEdge(this.moveAngle, this.x + dx, this.y + dy, world.width, world.height);
		this.x = XYA.newX;
		this.y = XYA.newY;
		this.moveAngle = XYA.angle;
	}


	private moveCellNormal(world: MicroWorld_world)
	{
		if (this.food >= 0)
		{
			if (this.curSpeed <= 0)
			{
				if (this.food > 0)
				{
					this.moveAngle = this.turnToLeaves(world);
					this.curSpeed = this.speed;
				}
				this.food -= this.hunger;
			}
			else
			{
				this.curSpeed -= world.viscosity;
			}

			this.moveCell(world);

			if (this.leavesIntersect(world).intersect)
			{
				this.state = this.Type_state.eating;
			}
		}
		else
		{
			this.state = this.Type_state.dead;
		}
	}
	private turnToLeaves(world: MicroWorld_world)
	{
		const leaves = world.getIntersectLeaves_First({ x: this.x, y: this.y, r: this.viewRange });
		if (leaves != undefined)
		{
			const pos = leaves.getCircle();
			return Math.atan2(pos.y - this.y, pos.x - this.x);
		}
		return Math.random() * Math.PI * 2;
		// return 20 / 180 * Math.PI;
	}
	private leavesIntersect(world: MicroWorld_world)
	{
		const leaves = world.getIntersectLeaves_First({ x: this.x, y: this.y, r: this.eatRange });
		if (leaves != undefined)
		{
			return { intersect: true, obj: leaves };
		}
		return {intersect: false};;
	}

	private eatNormal(world: MicroWorld_world)
	{
		if (this.curSpeed > 0)
		{
			this.curSpeed -= 0.5;
		}
		else
		{
			this.curSpeed = 0;
			const intersection = this.leavesIntersect(world);
			if (intersection.intersect && intersection.obj != undefined)
			{
				if (this.foodCD == 0)
				{
					this.food += intersection.obj.getSomeFood(world);
					this.foodCD = this.foodCooldown;
				}
			}
			else
			{
				this.state = this.Type_state.moving;
			}
		}
		this.moveCell(world);
	}

	private deadNormal(world: MicroWorld_world)
	{
		this.color = "black";
		this.cellAlpha = Math.max(this.cellAlpha - 0.01, 0);
		if (this.cellAlpha == 0) this.removeCell = true;
	}
}