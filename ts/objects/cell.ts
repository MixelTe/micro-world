import { MicroWorld_world } from "./World.js";
import { randomInt, circlePointIntersect, rectPointIntersect } from "./functions.js";
import { MicroWorld_leaves } from "./leaves.js";
import { Point } from "../interfaces.js";

export abstract class MicroWorld_cell
{
	protected readonly Type_speed = { normal: 6 };
	protected readonly Type_viewRange = { normal: 70 };
	protected readonly Type_food = { normal: 10 };
	protected readonly Type_hunger = { normal: 1 };
	protected readonly Type_movement = { normal: this.movementNormal }
	protected readonly Type_foodType = { leaves: 1 };
	protected readonly Type_state = { moving: 1, eating: 2 };

	protected abstract speed: number;
	protected abstract viewRange: number;
	protected abstract food: number;
	protected abstract foodType: number;
	protected abstract hunger: number;
	public abstract movement: (world: MicroWorld_world) => void;
	private color = "lightGreen";
	private state = this.Type_state.moving;
	private zoom = 1;

	constructor(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}
	protected applyZoom(zoom: number)
	{
		this.zoom = zoom;
		this.speed *= zoom;
		this.viewRange *= zoom;
		this.eatRange *= zoom;
	}

	private x: number;
	private y: number;
	private eatRange = 20;
	private moveAngle = 0;
	private curSpeed = 0;

	public draw(ctx: CanvasRenderingContext2D)
	{
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 10 * this.zoom, 0, 2 * Math.PI);
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
			ctx.fillText(`${this.food}`, 0, -30 * this.zoom);
			ctx.restore();
			ctx.restore();

			ctx.translate(this.x, this.y)
			ctx.rotate(this.moveAngle);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(100 * this.zoom, 0);
			ctx.stroke();
			ctx.restore();
		}

		ctx.restore();
	}

	private movementNormal(world: MicroWorld_world)
	{
		switch (this.state)
		{
			case this.Type_state.moving:
				this.moveCellNormal(world);
				break;

			case this.Type_state.eating:
				this.eatNormal(world);
				break;
		}
	}

	private moveCell(world: MicroWorld_world)
	{
		const angle = this.moveAngle;
		this.x += this.curSpeed * Math.cos(angle);
		this.y += this.curSpeed * Math.sin(angle);

		this.x = (this.x + world.width) % world.width;
		this.y = (this.y + world.height) % world.height;
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
			this.color = "black";
		}
	}
	private turnToLeaves(world: MicroWorld_world)
	{
		for (let i = 0; i < world.leaves.length; i++)
		{
			const el = world.leaves[i];
			const pos = el.getPosition();
			const angle = Math.atan2(pos.y - this.y, pos.x - this.x);
			const intersection = this.pointIntersection(world, pos, this.viewRange);
			if (intersection.intersect)
			{
				if (intersection.inside)
				{
					return angle;
				}
				else
				{
					return angle - Math.PI;
				}
			}
		}
		return Math.random() * Math.PI * 2;
	}
	private pointIntersection(world: MicroWorld_world, pos: Point, r: number)
	{
		if (circlePointIntersect(this.x, this.y, r, pos.x, pos.y))
		{
			return {intersect: true, inside: true};
		}
		if (!rectPointIntersect({ x: r, y: r, width: world.width - r * 2, height: world.height - r * 2 }, { x: this.x, y: this.y }))
		{
			if (circlePointIntersect(this.x, this.y, r, pos.x + world.width, pos.y) ||
				circlePointIntersect(this.x, this.y, r, pos.x - world.width, pos.y) ||
				circlePointIntersect(this.x, this.y, r, pos.x, pos.y + world.height) ||
				circlePointIntersect(this.x, this.y, r, pos.x, pos.y - world.height) ||
				circlePointIntersect(this.x, this.y, r, pos.x + world.width, pos.y + world.height) ||
				circlePointIntersect(this.x, this.y, r, pos.x + world.width, pos.y - world.height) ||
				circlePointIntersect(this.x, this.y, r, pos.x - world.width, pos.y + world.height) ||
				circlePointIntersect(this.x, this.y, r, pos.x - world.width, pos.y - world.height))
			{
				return {intersect: true, inside: false};
			}
		}
		return {intersect: false, inside: false};
	}
	private leavesIntersect(world: MicroWorld_world)
	{
		for (let i = 0; i < world.leaves.length; i++)
		{
			const el = world.leaves[i];
			const intersection = this.pointIntersection(world, el.getPosition(), this.eatRange);
			if (intersection.intersect) return {intersect: true, obj: el};
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
				this.food += intersection.obj.getSomeFood(world);
			}
			else
			{
				this.state = this.Type_state.moving;
			}
		}
		this.moveCell(world);
	}
}