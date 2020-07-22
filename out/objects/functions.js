export function randomInt(bound) {
    return Math.floor(Math.random() * bound);
}
export function randomIntFrom(start, bound) {
    return Math.floor(Math.random() * bound) + start;
}
export function circlePointIntersect(cx, cy, cr, px, py) {
    return cr >= Math.sqrt((cx - px) * (cx - px) + (cy - py) * (cy - py));
}
export function rectPointIntersect(rect, point) {
    return (rect.x + rect.width > point.x &&
        point.x > rect.x &&
        rect.y + rect.height > point.y &&
        point.y > rect.y);
}
