import { MicroWorld_world } from "./objects/World.js";

export class MicroWorld
{
	private canva = document.createElement("canvas");
	private ctx: CanvasRenderingContext2D;

	private worldColor = "darkBlue";
	private world: MicroWorld_world;
	private minLeaves = 5;

	constructor(div: HTMLDivElement)
	{
		this.canva.style.width = "100%";
		this.canva.style.height = "100%";
		div.appendChild(this.canva);
		const canvaBCR = this.canva.getBoundingClientRect();
		this.canva.style.width = `${canvaBCR.width}px`;
		this.canva.style.height = `${canvaBCR.height}px`;
		const zoom = 1;
		this.canva.width = canvaBCR.width * zoom;
		this.canva.height = canvaBCR.height * zoom;

		const ctx = this.canva.getContext("2d");
		if (ctx == null) throw new Error("canvas context not found");
		this.ctx = ctx;

		this.ctx.translate(0, this.canva.height);
		this.ctx.scale(1, -1);
		this.world = new MicroWorld_world(this.canva.width, this.canva.height);
		// this.world.generateCells();
		this.minLeaves = this.world.generateLeaves();

		this.nextFrame();
	}

	private nextFrame(this: MicroWorld)
	{
		this.calculateAll();
		this.drawAll();
		requestAnimationFrame(this.nextFrame.bind(this));
	}

	private calculateAll()
	{
		this.world.calculateAll();
	}

	private drawAll()
	{
		this.ctx.save();
		this.ctx.fillStyle = this.worldColor;
		this.ctx.fillRect(0, 0, this.canva.width, this.canva.height);

		this.world.drawAll(this.ctx);

		this.ctx.restore();
	}
}
