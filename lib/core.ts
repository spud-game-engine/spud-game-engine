export interface Bundle<T>{
	[index:string]:T,
	[index:number]:T,
}
export abstract class Input{
	/** Start listening for input */
	abstract play():void
	/** Stop listening for input */
	abstract pause():void
	abstract events:{[index:string]:(info:any)=>any}
	abstract trigger:(name:string,info?:any)=>any
}
export interface SpriteInfo{}
export interface RenderInfo{}
export interface PhysicsInfo{}
/**
* An in-game object
*/
export abstract class Sprite{
	spriteInfo:SpriteInfo={}
	renderInfo:RenderInfo={}
	physicsInfo:PhysicsInfo={}
	/** Draw the sprite
	* Update [[renderInfo]] from [[spriteInfo]] then draw*/
	abstract rendererFrame():void
	/** Update physics status of the sprite
	* Update [[physicsInfo]], then update that to [[spriteInfo]]*/
	abstract physicsFrame():void
}
/**
* A collection of sprites
*/
export abstract class Collection {
	sprites:Bundle<Sprite>={}
	collections:Bundle<Collection>={}
	rendererFrame(){
		for(let i in this.sprites){
			this.sprites[i].rendererFrame()
		}
		for(let i in this.collections){
			this.collections[i].rendererFrame()
		}
	}
	physicsFrame(){
		for(let i in this.sprites){
			this.sprites[i].physicsFrame()
		}
		for(let i in this.collections){
			this.collections[i].physicsFrame()
		}
	}
}
/**
* A container for sprites, often a level
*/
export abstract class Stage extends Collection{
	abstract inputs:Input[]
	private interval:number=-1;
	/** Play the stage
	* Call inputs[].play. Also call rendererFrame and physicsFrame
	* regularally
	*/
	play(){
		this.inputs.map((i)=>i.play())
		this.interval=setInterval(()=>{
			//we may want these two to be on different intervals
			this.rendererFrame();
			this.physicsFrame();
		},1000/80);
	}
	/** Pause the stage
	* Call inputs[].pause. Also stop auto calling of rendererFrame and
	* physicsFrame
	*/
	pause(){
		this.inputs.map((i)=>i.pause())
		clearInterval(this.interval);
	}
}
/**
* The base class for all games
*/
export abstract class Game{
	/**
	* The current stage
	*/
	stageID:number|string=-1;
	/**
	* All stages
	*/
	stages:Bundle<Stage>={};
	/**
	* Play the game
	* @param id If supplied, sets [[stageID]]
	*/
	play(id?:number|string) {
		if (typeof id!="undefined") this.stageID=id;
		this.stages[this.stageID].play()
	}
	/**
	* Pause the game
	*/
	pause() {
		this.stages[this.stageID].pause()
	}
}

