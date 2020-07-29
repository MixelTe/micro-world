import { Rect, Point, Circle } from "../interfaces";

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

export function circlesIntersect(circle1: Circle, circle2: Circle)
{
    let maxDistanceSquared = circle1.r + circle2.r;
    maxDistanceSquared *= maxDistanceSquared;

    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;

    const currentDistanceSquared = dx * dx + dy * dy;

    return currentDistanceSquared < maxDistanceSquared;
}

// function intersectionPoints(c1: Circle, c2: Circle)
// {
//     let dx = c2.x - c1.x;
//     let dy = c2.y - c1.y;
//     const d = Math.sqrt(dx * dx + dy * dy);

//     // Circles too far apart
//     if (d > c1.r + c2.r) { return; }

//     // One circle completely inside the other
//     if (d < Math.abs(c1.r - c2.r)) { return; }

//     dx /= d;
//     dy /= d;

//     const a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d);
//     const px = c1.x + a * dx;
//     const py = c1.y + a * dy;

//     const h = Math.sqrt(c1.r * c1.r - a * a);

//     return {
//         p1: {
//             x: px + h * dy,
//             y: py - h * dx
//         },
//         p2: {
//             x: px - h * dy,
//             y: py + h * dx
//         }
//     }
// }

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

    return { newX, newY, angle };
}