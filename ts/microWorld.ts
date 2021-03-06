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
		const width = canvaBCR.width;
		const height = canvaBCR.height;
		// const height = Math.floor(canvaBCR.width / 16 * 9);
		this.canva.style.width = `${width}px`;
		this.canva.style.height = `${height}px`;
		const zoom = 1;
		this.canva.width = width * zoom;
		this.canva.height = height * zoom;

		const ctx = this.canva.getContext("2d");
		if (ctx == null) throw new Error("canvas context not found");
		this.ctx = ctx;

		this.ctx.translate(0, this.canva.height);
		this.ctx.scale(1, -1);
		this.world = new MicroWorld_world(this.canva.width, this.canva.height);
		this.world.generateCells();
		this.minLeaves = this.world.generateLeaves();

		this.nextFrame();
	}

	private nextFrame(this: MicroWorld)
	{
		if (this.world.CellsCount > 0)
		{
			this.calculateAll();
		}
		this.drawAll();
		requestAnimationFrame(this.nextFrame.bind(this));
	}

	private cell2Created = false;
	private calculateAll()
	{
		this.world.calculateAll();
		if (!this.cell2Created && this.world.WorldAge > 400)
		{
			this.world.generateCells2();
			this.cell2Created = true;
		}
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
