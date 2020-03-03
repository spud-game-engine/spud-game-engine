//TODO: Make static vs. mobile objects? - There's a built in JavaScript tool that freezes an object. This could be usefull.
/** A class that allows for calling and registering event handlers */
export abstract class EventHost{
	/**
	 * The container for the event handlers
	 */
	events:{
		[index:string]:((info:any)=>number)[]
	}={}
	/**
	 * Trigger an event
	 * 
	 * @param name The name of the event.
	 * @param info The optional information about the event.
	 * @return An array of the returns of the event handlers
	 */
	trigger(name:string,info?:any):Promise<number[]> {
		//return this.events[name].map((f)=>f(info));
		return Promise.all( //TODO: add Promise polyfill. TODO: This is completly wrong. Just use a lib
			this.events[name].map(
				(eventHandler)=>
					//()=>
					eventHandler(info)))
	}
	/**
	 * Bind an event handler.
	 *
	 * @param name The name of the event.
	 * @param handler The new event handler.
	 */
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
		this.rendererFrame=collection.renderer.__frame
		this.physicsFrame=collection.physics.__frame
	}
	abstract renderInfo:RenderInfo
	abstract physicsInfo:PhysicsInfo
	/** Draw the sprite
	* Update [[renderInfo]] from [[this]] then draw*/
	rendererFrame:()=>void=()=>void 0
	/** Update physics status of the sprite
	* Update [[physicsInfo]], then update that to [[this]]*/
	physicsFrame:()=>void=()=>void 0
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
export abstract class Collection extends EventHost{
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
	private interval:number=-1;
	/** Play the stage
	* Call inputs[].play. Also call rendererFrame and physicsFrame
	* regularally
	*/
	play(){
		this.inputs.map((i)=>i.play())
		this.interval=window.setInterval(()=>{//TODO: Not a great fix
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

