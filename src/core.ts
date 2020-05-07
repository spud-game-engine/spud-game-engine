//import interval from 'interval-promise'

//Polyfills. According to corejs's doc, this is how Babel does their polyfills
//From testing, it seems that `tsc` doesn't do this.
//TODO: import 'core-js/stable';
//TODO: import 'regenerator-runtime/runtime';
import { Subject, Observable } from 'rxjs';
import { map, filter } from "rxjs/operators";

//TODO: explain
export type Playing=Subject<boolean>
/**
 * The "driver" for input. Detects when the user gives input.
 *
 * In charge of these things:
 *
 *  * Listening for input from all players (and distinguishing them) TODO:verify
 */
export abstract class Input{
	/** Inputs must have a subject where the passed observable completes at the end
	 *  of the input event
	 */
	abstract event:Subject<Observable<InputInfo>>
	//TODO: explain
	playing:Playing
	//TODO: explain //TODO: evaluate optionability
	constructor(stage:Stage|Collection){
		this.playing=stage.playing
	}
	//TODO: observable to handle new devices
}
//TODO: explain
export interface InputInfo{//TODO: adjust to better fit needs later
	//TODO: explain
	device:string|number|Array<string|number>
	//TODO: explain
	key:number
	//TODO: explain
	value:number|Array<number>
}
/** Where render-specific information about a sprite is stored */
export interface RenderInfo{}
//TODO: write docstring
export type RendererActor=(item:Collection|Sprite)=>void
/**
 * Abstract renderer engine class
 *
 * In charge of these things:
 *
 *  * Show sprites animating on "screen" (whatever screen that may be) TODO:verify
 */
export abstract class Renderer{
	//TODO: write docstring
	abstract render_loop:Subject<RendererActor>
}
/** Where Physics-specific information about a specific sprite is stored */
export interface PhysicsInfo{}
//TODO: write docstring
export type PhysicsActor=(item:Collection|Sprite)=>void
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
	//TODO: write docstring
	abstract physics_loop:Subject<PhysicsActor>
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
}
/**
 * A container for sprites, often used as a level
 * 
 * In charge of these things:
 * 
 *  * Tell the inputs when to play or pause. TODO:verify
 *  * Allow for input events to trigger changes in the contained sprites and
 * constructors inherited from [[Collection]] TODO:verify
 *  * Tell the [[Renderer]] when to render. TODO:verify
 *  * Tell the [[Physics]] when to update. TODO:verify
 */
export abstract class Stage {
	/** The items stored within the collection. */
	sprites:{[index:string]:Sprite}={}
	collections:{[index:string]:Collection}={}

	/** The reference to the input handler */
	abstract input:Input

	/** The reference to the renderer engine */
	abstract renderer:Renderer

	/** The reference to the physics engine */
	abstract physics:Physics

	//TODO: write docstring
	abstract playing:Playing

	//TODO: write docstring
	play(state:boolean=true){
		this.playing.next(state)
	}

	//TODO: write docstring
	pause(state:boolean=true){
		this.play(!state)
	}
}
//*/
/**
 * A collection of [[Sprite]]s and [[Collection]]s
 *
 * In charge of these things:
 * 
 *  * Holding other instances of [[Collection]] TODO:verify
 *  * Holding instances of [[Sprite]] TODO:verify
 *  * Pass down the message of when the [[Renderer]] was told to render. TODO:verify
 *  * Pass down the message of when [[Physics]] was told to update. TODO:verify
 *  * Tell the [[Renderer]] when all instances of [[Sprite]] that this directly
 * or indirectly mannages are rendered. TODO:verify
 *  * Tell the [[Physics]] when all instances of [[Sprite]] that this directly
 * or indirectly mannages have been updated. TODO:verify
 */
export abstract class Collection extends Stage{ 
	input:Input
	renderer:Renderer
	physics:Physics
	playing:Playing
	constructor(collection_or_stage:Collection|Stage){
		super()
		this.input=collection_or_stage.input
		this.renderer=collection_or_stage.renderer
		this.physics=collection_or_stage.physics
		this.playing=collection_or_stage.playing
	}
}

