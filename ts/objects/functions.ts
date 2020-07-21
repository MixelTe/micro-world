import { Rect, Point } from "../interfaces";

export function randomInt(bound: number)
{
	return Math.floor(Math.random() * bound);
}

export function randomIntFrom(start: number, bound: number)
{
	return Math.floor(Math.random() * bound) + start;
}

export function circlePointIntersect(cx: number, cy: number, cr: number, px: number, py: number)
{
	return cr >= Math.sqrt((cx - px) * (cx - px) + (cy - py) * (cy - py));
}

export function rectPointIntersect(rect: Rect, point: Point)
{
    return (
        rect.x + rect.width > point.x &&
        point.x > rect.x &&
        rect.y + rect.height > point.y &&
        point.y > rect.y
    );
}
