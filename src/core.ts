//import interval from 'interval-promise'
//Look into `npm i wolfy87-eventemitter` github https://github.com/Olical/EventEmitter
 //Compare to https://github.com/primus/EventEmitter3 more at https://www.npmjs.com/search?q=eventemitter
//TODO: Make static vs. mobile objects? - There's a built in JavaScript tool that freezes an object. This could be usefull.
export abstract class Input{
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
		sprite.render=()=>this.__frame(sprite);//TODO: Improove
	}
}
export interface Move{
	to(...location:number[]):Move
	by(...location:number[]):Move
}
export interface PhysicsInfo{
	move(params:{
		safe:boolean
	}):Move
}
export abstract class Physics{
	abstract __frame(sprite:Sprite):void
	/** Bind a given sprite to call [[__frame]] on the `"physics"` event */
	attach(sprite:Sprite){
		sprite.physics_loop=()=>this.__frame(sprite);
	}
}
/**
* An in-game object
*/
export abstract class Sprite{ 
	constructor(collection:Collection){
		collection.renderer.attach(this);
		collection.physics.attach(this);
	}
	abstract renderInfo:RenderInfo
	abstract physicsInfo:PhysicsInfo
	render:()=>void=()=>undefined
	physics_loop:()=>void=()=>undefined
	move(params:{
		safe:boolean
	}={
		safe:true
	}):Move{
		return this.physicsInfo.move(params);
	}
}
/**
* A collection of sprites
*/
export abstract class Collection{ 
	/** Make a new collection */
	constructor(renderer:Renderer,physics:Physics){
		this.renderer=renderer
		this.physics=physics
		//TODO: pass these "events"
	    //this.pass("render");
	    //this.pass("physics");
	}
	/** The items stored within the collection. */
	sprites:{[index:string]:Sprite}={}
	collections:{[index:string]:Collection}={}
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
		this.render();
		this.physics_loop();
	}
	render:()=>void=()=>undefined
	physics_loop:()=>void=()=>undefined
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

