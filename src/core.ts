//import interval from 'interval-promise'
import EventEmitter from 'events-async'
//TODO: Make static vs. mobile objects? - There's a built in JavaScript tool that freezes an object. This could be usefull.
export abstract class Input extends EventEmitter{
	/** Start listening for input */
	abstract play():void
	/** Stop listening for input */
	abstract pause():void
}
export interface RenderInfo{}
export abstract class Renderer{
	abstract __frame(sprite:Sprite):void
	/** Bind a given sprite to call [[__frame]] on the `"render"` event */
	attach(sprite:Sprite) {
		sprite.on("render",()=>this.__frame(sprite));
	}
}
export interface PhysicsInfo{}
export abstract class Physics{
	abstract __frame(sprite:Sprite):void
	/** Bind a given sprite to call [[__frame]] on the `"physics"` event */
	attach(sprite:Sprite){
		sprite.on("physics",()=>this.__frame(sprite));
	}
}
export interface Move{
	to(...location:number[]):Move
	by(...location:number[]):Move
}
//TODO: use the Node based design scheme. Sprites should inherit from nodes, and collections are useless, as nodes can carry other nodes.
/**
* An in-game object
*/
export abstract class Sprite{
	constructor(collection:Collection){
		super()
		collection.renderer.attach(this);
		collection.physics.attach(this);
	}
	abstract renderInfo:RenderInfo
	abstract physicsInfo:PhysicsInfo
	/** Update physics status of the sprite
	* Update [[physicsInfo]], then update that to [[this]]*/
	private genericMove(safe:boolean):Move{
		let out:Move={
			to(...location){
				console.log(`Moved to ${location}!`)
				if(safe) console.log("this was safe")
				return out;
			},
			by(...location){
				console.log(`Moved by ${location}!`)
				if(safe) console.log("this was safe")
				return out;
			}
		}
		return out;
	}
	safeMove():Move{
		return this.genericMove(true);
	}
	unsafeMove():Move{
		return this.genericMove(false);
	}
}
/**
* A collection of sprites
*/
export abstract class Collection extends EventEmitter{
	/** Make a new collection */
	constructor(renderer:Renderer,physics:Physics){
		super()
		this.renderer=renderer
		this.physics=physics
	}
	/** The items stored within the collection. */
	sprites:{[index:string]:Sprite}={}
	collections:{[index:string]:Collection}={}
	/** Call all [[Sprite.rendererFrame]] and [[Collection.rendererFrame]]s */
	rendererFrame(){
		for(let i in this.sprites){
			this.sprites[i].emit("render");
		}
		for(let i in this.collections){
			this.collections[i].rendererFrame()
		}
	}
	physicsFrame(){
		for(let i in this.sprites){
			this.sprites[i].emit("render")
		}
		for(let i in this.collections){
			this.collections[i].physicsFrame()
		}
	}
	/** The reference to the renderer engine */
	renderer:Renderer
	/** The reference to the physics engine */
	physics:Physics
}
/**
* A container for sprites, often a level
*/
export abstract class Stage extends Collection{
	constructor(renderer:Renderer,physics:Physics,input:Input|Input[]){
		super(renderer,physics)
		if(input instanceof Input) input=[input];
		this.inputs=input;
	}
	inputs:Input[]
	/** To be called on every frame of the game loop */
	frame() {
		this.rendererFrame();
		this.physicsFrame();
	}
	//private interval:number=-1;
	//private __playing=false;
	/** Play the stage
	 * Call inputs[].play. Also start calling this.frame regularrally
	 */
   	abstract play():void
	/*play(){
		this.inputs.map((i)=>i.play())
		this.__playing=true;
		let loop =async (iteration:number,stop:()=>void)=>{
			if (!this.__playing) {
				//This log was literally put here to appease the great linter gods
				console.log(`Stopped at iteration ${iteration}`);
				return stop()
			}
			this.rendererFrame()
			this.physicsFrame()
		}
		interval(loop,1000/80);//TODO: let them decide the frequency?
		/*
		this.interval=window.setInterval(()=>{//TODO: Not a great fix
			//we may want these two to be on different intervals
			this.rendererFrame();
			this.physicsFrame();
		},1000/80);
	    *
	}*/
	/** Pause the stage
	 * Call inputs[].pause. Also stop auto calling this.frame
	 */
	abstract pause():void
	/*pause(){
		this.__playing=false;
	}*/
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
	stages:{[index:string]:Stage}={};
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

