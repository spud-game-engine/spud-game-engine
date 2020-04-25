//import interval from 'interval-promise'

//Polyfills. According to corejs's doc, this is how Babel does their polyfills
//From testing, it seems that `tsc` doesn't do this.
//TODO: import 'core-js/stable';
//TODO: import 'regenerator-runtime/runtime';
//TODO: use rxjs subjects instead of this flimsy event system coded here

/**
 * The "driver" for input. Detects when the user gives input.
 *
 * In charge of these things:
 *
 *  * Listening for input from all players (and distinguishing them) TODO:verify
 */
export abstract class Input{
	/** Start listening for input */
	abstract play(stage:Stage):void
	/** Stop listening for input */
	abstract pause():void
}
export interface RenderInfo{}
/**
 * Abstract renderer engine class
 *
 * In charge of these things:
 *
 *  * Show sprites animating on "screen" (whatever screen that may be) TODO:verify
 */
export abstract class Renderer{
	/** Render the given sprite */
	abstract render_loop(sprite:Sprite):void
	/** Render the given collection */
	abstract render_loop(collection:Collection):void
}
/** Where Physics-specific information about a specific sprite is stored */
export interface PhysicsInfo{}
/**
 * Abstract physics engine class.
 *
 * In charge of these things:
 *
 *  * Allow for sprites to interact with oneanother TODO:verify
 *  * Allow for sprites to be interacted upon (like by an event, for example) TODO:verify
 *  * Check that recent interactions are reflected in shared state variables on
 * the [[Sprite]] or [[Collection]] objects themselves. TODO:verify
 */
export abstract class Physics{
	/** Preform a physics check & update on given sprite */
	abstract physics_loop(sprite:Sprite):void
	/** Preform a physics check & update on given collection */
	abstract physics_loop(collection:Collection):void
}
/**
 * An in-game object
 * 
 * In charge of these things:
 * 
 *  * Tell the [[Renderer]] and [[Physics]] to update itself. TODO:verify
 *  * Store information unique to physics (such as the hitbox) in
 * [[PhysicsInfo]] TODO:verify
 *  * Store information unique to rendering (such as image resource) in
 * [[RenderInfo]] TODO:verify
 *  * Directly store information shared between both [[Physics]] and
 * [[Renderer]] (such as location) TODO:verify
 */
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
/**
 * A collection of [[Sprite]]s and [[Collection]]s
 *
 * In charge of these things:
 * 
 *  * Holding other instances of [[Collection]]
 *  * Holding instances of [[Sprite]]
 *  * Pass down the message of when the [[Renderer]] was told to render.
 *  * Pass down the message of when [[Physics]] was told to update.
 *  * Tell the [[Renderer]] when all instances of [[Sprite]] that this directly
 * or indirectly mannages are rendered. TODO:verify
 *  * Tell the [[Physics]] when all instances of [[Sprite]] that this directly
 * or indirectly mannages have been updated. TODO:verify
 */
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
	render_loop() {//TODO: use promises
		//Call order is least generic to most
		for (let i in this.sprites) {
			this.sprites[i].render_loop();
		}
		for (let i in this.collections) {
			this.collections[i].render_loop();
		}
		this.renderer.render_loop(this)
	}
	physics_loop(){//TODO: use promises
		//Call order is least generic to most
		for (let i in this.sprites) {
			this.sprites[i].physics_loop();
		}
		for (let i in this.collections) {
			this.collections[i].physics_loop();
		}
		this.physics.physics_loop(this)
	}
}
/**
 * A container for sprites, often used as a level
 * 
 * In charge of these things:
 * 
 *  * Tell the inputs when to play or pause.
 *  * Allow for input events to trigger changes in the contained sprites and
 * constructors inherited from [[Collection]] TODO:verify
 *  * Tell the [[Renderer]] when to render.
 *  * Tell the [[Physics]] when to update.
 */
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
		this.inputs.map((v)=>v.play(this))
	}
	/**
	 * Pause the stage
	 */
	pause() {
		this.inputs.map((v)=>v.pause())
	}
}
//TODO: validate a need once I'm done integrating with rxjs
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

