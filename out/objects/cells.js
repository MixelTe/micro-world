import { MicroWorld_cell } from "./cell.js";
export class MicroWorld_Cell_Simple extends MicroWorld_cell {
    constructor(x, y) {
        super(x, y);
        this.speed = this.Type_speed.normal;
        this.viewRange = this.Type_viewRange.normal;
        this.food = this.Type_food.normal;
        this.foodType = this.Type_foodType.leaves;
        this.hunger = this.Type_hunger.normal;
        this.movement = this.Type_movement.normal;
    }
}
