export interface Bundle<T>{
	[index:string]:T,
	[index:number]:T,
}
export abstract class EventHost{
	events:{[index:string]:((info:any)=>any)[]}={}
	trigger(name:string,info?:any):any[] {
		return this.events[name].map((f)=>f(info));
	}
	on(name:string,handler:(info:any)=>any) {
		if (typeof this.events[name]=="undefined") this.events[name]=[];
		this.events[name].push(handler)
	}
}
export abstract class Input extends EventHost {
	/** Start listening for input */
	abstract play():void
	/** Stop listening for input */
	abstract pause():void
}
export interface RenderInfo{}
export abstract class Renderer{
	abstract __frame:()=>void
}
export interface PhysicsInfo{}
export abstract class Physics{
	abstract __frame:()=>void
}
/**
* An in-game object
*/
export abstract class Sprite{
	renderInfo:RenderInfo={}
	physicsInfo:PhysicsInfo={}
	/** Draw the sprite
	* Update [[renderInfo]] from [[this]] then draw*/
	rendererFrame:()=>void=()=>void 0
	/** Update physics status of the sprite
	* Update [[physicsInfo]], then update that to [[this]]*/
	physicsFrame:()=>void=()=>void 0
	constructor(collection:Collection){
		this.rendererFrame=collection.renderer.__frame
		this.physicsFrame=collection.physics.__frame
	}
}
/**
* A collection of sprites
*/
export abstract class Collection extends EventHost{
	abstract items:Bundle<Sprite|Collection>
	rendererFrame(){
		for(let i in this.items){
			this.items[i].rendererFrame()
		}
		//for(let i in this.collections){
			//this.collections[i].rendererFrame()
		//}
	}
	physicsFrame(){
		for(let i in this.items){
			this.items[i].physicsFrame()
		}
		//for(let i in this.collections){
			//this.collections[i].physicsFrame()
		//}
	}
	renderer:Renderer
	physics:Physics
	constructor(renderer:Renderer,physics:Physics){
		super()
		this.renderer=renderer
		this.physics=physics
	}
}
/**
* A container for sprites, often a level
*/
export abstract class Stage extends Collection{
	inputs:Input[]
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
	constructor(renderer:Renderer,physics:Physics,input:Input|Input[]){
		super(renderer,physics)
		if(input instanceof Input) input=[input];
		this.inputs=input;
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

