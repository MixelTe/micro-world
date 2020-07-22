import { MicroWorld } from "./microWorld.js";
new MicroWorld(getdiv("gameDiv"));
function getdiv(id) {
    const el = document.getElementById(id);
    if (el == null)
        throw new Error(`${id} not found`);
    if (el instanceof HTMLDivElement)
        return el;
    throw new Error(`${id} element not Div`);
}
