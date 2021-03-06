import { MicroWorld_cell } from "./cell.js";
import { MicroWorld_world } from "./World.js";

export class MicroWorld_Cell_Simple extends MicroWorld_cell
{
	protected moveSpeed = this.Type_speed.normal;
	protected viewRange = this.Type_viewRange.normal;
	protected food = this.Type_food.normal;
	protected foodCooldown = this.Type_foodCooldown.normal;
	protected foodType = this.Type_foodType.leaves;
	protected hunger = this.Type_hunger.normal;
	protected multiplyAge = this.Type_multiplyAge.normal;
	protected growTime = this.Type_growTime.normal;
	public calculate = this.Type_calculate.normal;

	constructor(x: number, y: number, food?: number)
	{
		super(x, y, food);
	}

	createChild(x: number, y: number, food: number, world: MicroWorld_world)
	{
		world.addCell(new MicroWorld_Cell_Simple(x, y, food));
		// world.createCell_Simple(x, y, food);
	}
}

export class MicroWorld_Cell_CellEating extends MicroWorld_cell
{
	protected moveSpeed = this.Type_speed.fast;
	protected viewRange = this.Type_viewRange.increased;
	protected food = this.Type_food.normal;
	protected foodCooldown = this.Type_foodCooldown.fast;
	protected foodType = this.Type_foodType.cells;
	protected hunger = this.Type_hunger.normal;
	protected multiplyAge = this.Type_multiplyAge.normal;
	protected growTime = this.Type_growTime.decreased;
	public calculate = this.Type_calculate.normal;

	constructor(x: number, y: number, food?: number)
	{
		super(x, y, food);
	}

	createChild(x: number, y: number, food: number, world: MicroWorld_world)
	{
		world.addCell(new MicroWorld_Cell_CellEating(x, y, food));
	}
}