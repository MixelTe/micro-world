import { Rect, Point } from "../interfaces";

export function randomInt(bound: number)
{
	return Math.floor(Math.random() * bound);
}

export function randomIntFrom(start: number, bound: number)
{
	return Math.floor(Math.random() * (bound - start)) + start;
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

export function bounceOnEdge(angle: number, x: number, y: number, width: number, height: number)
{
    let newX = x;
    let newY = y;
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
    if (newX != x) angle += Math.PI/2;
    if (newY != y) angle = -angle;

    return { newX, newY };
}