import { MicroWorld_cell } from "./cell.js";

export class MicroWorld_Cell_Simple extends MicroWorld_cell
{
	protected speed = this.Type_speed.normal;
	protected viewRange = this.Type_viewRange.normal;
	protected food = this.Type_food.normal;
	protected foodCooldown = this.Type_foodCooldown.normal;
	protected foodType = this.Type_foodType.leaves;
	protected hunger = this.Type_hunger.normal;
	public calculate = this.Type_calculate.normal;

	constructor(x: number, y: number)
	{
		super(x, y);
	}
}