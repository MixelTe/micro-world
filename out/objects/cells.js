import { MicroWorld_cell } from "./cell.js";
export class MicroWorld_Cell_Simple extends MicroWorld_cell {
    constructor(x, y, food) {
        super(x, y, food);
        this.moveSpeed = this.Type_speed.normal;
        this.viewRange = this.Type_viewRange.normal;
        this.food = this.Type_food.normal;
        this.foodCooldown = this.Type_foodCooldown.normal;
        this.foodType = this.Type_foodType.leaves;
        this.hunger = this.Type_hunger.normal;
        this.multiplyAge = this.Type_multiplyAge.normal;
        this.growTime = this.Type_growTime.normal;
        this.calculate = this.Type_calculate.normal;
    }
    createChild(x, y, food, world) {
        world.createCell_Simple(x, y, food);
    }
}
