//import interval from 'interval-promise'

//Polyfills. According to corejs's doc, this is how Babel does their polyfills
//From testing, it seems that `tsc` doesn't do this.
//TODO: import 'core-js/stable';
//TODO: import 'regenerator-runtime/runtime';

/** The "driver" for input. Detects when the user gives input. */
export abstract class Input{
	/** Start listening for input */
	abstract play():void
	/** Stop listening for input */
	abstract pause():void
}
export interface RenderInfo{}
/** Abstract renderer engine class */
export abstract class Renderer{
	/** Render the given sprite */
	abstract render_loop(sprite:Sprite):void
	/** Render the given collection */
	abstract render_loop(collection:Collection):void
}
export interface PhysicsInfo{}
/** Abstract physics engine class. */
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
	render_loop() {
		return this.renderer.render_loop(this)
	}
	physics_loop() {
		return this.physics.physics_loop(this)
	}
}
/** A collection of [[Sprite]]s and [[Collection]]s */
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
	render_loop() {//TODO: inverse order and use promises
		//Call order is most generic to least
		this.renderer.render_loop(this)
		for (let i in this.collections) {
			this.collections[i].render_loop();
		}
		for (let i in this.sprites) {
			this.sprites[i].render_loop();
		}
	}
	physics_loop(){//TODO: inverse order and use promises
		//Call order is most generic to least
		this.physics.physics_loop(this)
		for (let i in this.collections) {
			this.collections[i].physics_loop();
		}
		for (let i in this.sprites) {
			this.sprites[i].physics_loop();
		}
	}
}
/** A container for sprites, often used as a level */
export abstract class Stage extends Collection{
	constructor(renderer:Renderer,physics:Physics,input:Input|Input[]){
		super(renderer,physics)
		if(input instanceof Input) input=[input];
		this.inputs=input;
	}
	inputs:Input[]
	/**
	 * Play the stage
	 */
   	play() {
		this.inputs.map((v)=>v.play())
	}
	/**
	 * Pause the stage
	 */
	pause() {
		this.inputs.map((v)=>v.pause())
	}
}
/**
 * The base class for all games that have need for more than one
 * stage
 * 
 * In charge of holding [[Stage]] instances, and making sure that only one is
 * playing at a time.
 */
export abstract class Game{
	/** The current stage */
	stageID:number|string=-1;
	/** All stages */
	stages:{[index:string]:Stage}={};
	/** Is a stage currently running? */
	private playing:boolean=false
	/**
	 * Play the game
	 * @param id If supplied, sets [[stageID]]
	 */
	play(id?:number|string) {
		if(this.playing) this.pause();
		if (typeof id!="undefined") this.stageID=id;
		this.stages[this.stageID].play()
		this.playing=true
	}
	/** Pause the game */
	pause() {
		this.stages[this.stageID].pause()
		this.playing=false
	}
}

