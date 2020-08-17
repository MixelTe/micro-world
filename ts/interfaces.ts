import { MicroWorld_world } from "./objects/World";

export interface Rect
{
	x: number,
	y: number,
	width: number,
	height: number,
}

export interface Point
{
	x: number,
	y: number,
}

export interface Circle
{
    x: number,
    y: number,
    r: number,
}
export interface WorldCreature
{
	calculate: (world: MicroWorld_world) => boolean,
	getPosition: () => Point,
	getCircle: () => Circle,
	getSomeFood: (world: MicroWorld_world) => number
};