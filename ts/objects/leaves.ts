import { MicroWorld_leaves } from "./leavesClass.js";

export class MicroWorld_leaves_Simple extends MicroWorld_leaves
{
	calculate = this.Type_calculate.normal;
	growSpeed = this.Type_growSpeed.normal;
	growMax = this.Type_growMax.normal;
	spreadRadius = this.Type_spreadRadius.normal;
	constructor(x: number, y: number, food?: number, move?: boolean)
	{
		super(x, y, food, move);
	}
}