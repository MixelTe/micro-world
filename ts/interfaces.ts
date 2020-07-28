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

export interface WorldObject
{
	draw: (ctx: CanvasRenderingContext2D) => void,
	getPosition: () => Point,
}

export type worldCreature = { calculate: (world: MicroWorld_world) => boolean };