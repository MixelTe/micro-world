import { MicroWorld_world } from "./World.js";
import { circlePointIntersect, rectPointIntersect } from "./functions.js";
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
		const dx = this.curSpeed * Math.cos(this.moveAngle);
		const dy = this.curSpeed * Math.sin(this.moveAngle);

		const XY = this.bounceOnEdge(dx, dy, world.width, world.height);
		this.x = XY.newX;
		this.y = XY.newY;
	}

	private bounceOnEdge(dx: number, dy: number, width: number, height: number)
	{
		let newX = this.x + dx;
		let newY = this.y + dy;
		if (newX > width)
		{
			newX = width - (newX - width);
		}
		if (newX < 0)
		{
			newX = -newX;
		}
		if (newY > height)
		{
			newY = height - (newY - height);
		}
		if (newY < 0)
		{
			newY = -newY;
		}
		if (newX != this.x + dx) this.moveAngle += Math.PI/2;
		if (newY != this.y + dy) this.moveAngle = -this.moveAngle;

		return { newX, newY };
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
			if (circlePointIntersect(this.x, this.y, this.viewRange, pos.x, pos.y))
			{
				return angle;
			}
		}
		return Math.random() * Math.PI * 2;
		// return 20 / 180 * Math.PI;
	}
	private leavesIntersect(world: MicroWorld_world)
	{
		for (let i = 0; i < world.leaves.length; i++)
		{
			const el = world.leaves[i];
			const pos = el.getPosition();
			if (circlePointIntersect(this.x, this.y, this.eatRange, pos.x, pos.y)) return {intersect: true, obj: el};
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