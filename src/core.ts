//import interval from 'interval-promise'
//TODO: Make static vs. mobile objects? - There's a built in JavaScript tool that freezes an object. This could be usefull.
export abstract class Input{
	/** Start listening for input */
	abstract play():void
	/** Stop listening for input */
	abstract pause():void
}
export interface RenderInfo{}
export abstract class Renderer{
	/** Render the given sprite */
	abstract render(sprite:Sprite):void
	/** Render the given collection */
	abstract render(collection:Collection):void
}
export interface Move{
	to(...location:number[]):Move
	by(...location:number[]):Move
}
export interface PhysicsInfo{}
export abstract class Physics{
	/** Preform a physics check & update on given sprite */
	abstract physics_loop(sprite:Sprite):void
	/** Preform a physics check & update on given collection */
	abstract physics_loop(collection:Collection):void
}
/** An in-game object */
export abstract class Sprite{ 
	constructor(collection:Collection){
		this.renderer=collection.renderer
		this.physics=collection.physics
	}
	abstract renderInfo:RenderInfo
	abstract physicsInfo:PhysicsInfo
	renderer:Renderer
	physics:Physics
	render() {
		return this.renderer.render(this)
	}
	physics_loop() {
		return this.physics.physics_loop(this)
	}
	//TODO: add move again
}
/** A collection of sprites */
export abstract class Collection{ 
	/** Make a new collection */
	constructor(renderer:Renderer,physics:Physics){
		this.renderer=renderer
		this.physics=physics
	}
	/** The items stored within the collection. */
	sprites:{[index:string]:Sprite}={}
	collections:{[index:string]:Collection}={}
	/** The reference to the renderer engine */
	renderer:Renderer
	/** The reference to the physics engine */
	physics:Physics
	render() {
		for (let i in this.sprites) {
			this.sprites[i].render();
		}
		for (let i in this.collections) {
			this.collections[i].render();
		}
	}
	physics_loop(){
		for (let i in this.sprites) {
			this.sprites[i].physics_loop();
		}
		for (let i in this.collections) {
			this.collections[i].physics_loop();
		}
	}
}
/** A container for sprites, often a level */
export abstract class Stage extends Collection{
	constructor(renderer:Renderer,physics:Physics,input:Input|Input[]){
		super(renderer,physics)
		if(input instanceof Input) input=[input];
		this.inputs=input;
	}
	inputs:Input[]
	/**
	 * Play the stage
	 * Call inputs[].play. Also start calling this.frame regularrally
	 */
   	abstract play():void
	/**
	 * Pause the stage
	 * Call inputs[].pause. Also stop auto calling this.frame
	 */
	abstract pause():void
}
/** The base class for all games */
export abstract class Game{
	/** The current stage */
	stageID:number|string=-1;
	/** All stages */
	stages:{[index:string]:Stage}={};
	/**
	 * Play the game
	 * @param id If supplied, sets [[stageID]]
	 */
	play(id?:number|string) {
		if (typeof id!="undefined") this.stageID=id;
		this.stages[this.stageID].play()
	}
	/** Pause the game */
	pause() {
		this.stages[this.stageID].pause()
	}
}

