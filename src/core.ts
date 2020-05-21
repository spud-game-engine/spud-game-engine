//TODO: import 'regenerator-runtime/runtime';
import { Subject, Observable } from 'rxjs';
//TODO: validate all inputs using that library

/**
 * The "driver" for input. Detects when the user gives input.
 */
export abstract class Input{
	/** Inputs must have a subject where the passed observable completes at the end
	 *  of the input event
	 */
	abstract event:Subject<Observable<InputEventInfo>>
	//TODO: explain
	playing:Playing
	//TODO: explain //TODO: evaluate optionability
	constructor(stage:Stage|Collection){
		this.playing=stage.playing
	}
	/**
	 * Observable to handle new devices
	 */
	abstract connections:Subject<InputDeviceInfo>
}
//TODO: explain
export interface InputEventInfo{
	//TODO: explain
	device:string|number|Array<string|number>
	//TODO: explain
	key:number
	//TODO: explain
	value:number|Array<number>
}
/** Information about a new device being registered */
export interface InputDeviceInfo{
	name:string
	metadata:string
	type:"key"|"gamepad"|"pointer"
}
/** Where render-specific information about a sprite is stored */
export interface RenderInfo{}
//TODO: write docstring
export type RendererActor=(item:Collection|Sprite)=>void
/**
 * Abstract renderer engine class
 */
export abstract class Renderer{
	//TODO: write docstring
	abstract render_loop:Subject<RendererActor>
	//TODO: write docstring
	playing:Playing
	//TODO: write docstring
	constructor(stage:Stage|Collection){
		this.playing=stage.playing
	}
}
/** Where Physics-specific information about a specific sprite is stored */
export interface PhysicsInfo{}
//TODO: write docstring
export type PhysicsActor=(item:Collection|Sprite)=>void
/**
 * Abstract physics engine class.
 */
export abstract class Physics{
	//TODO: write docstring
	abstract physics_loop:Subject<PhysicsActor>
	//TODO: write docstring
	playing:Playing
	//TODO: write docstring
	constructor(stage:Stage|Collection){
		this.playing=stage.playing
	}
}
/**
 * An in-game object
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
/** An object containing only sprites */
export type Sprites<T=Sprite>={[index:string]:T}
/** An object containing only collections */
export type Collections<T=Collection>={[index:string]:T}
/** The Push-based multicast object indicating if the game is starting or
 * pausing.
 * 
 * The game should be concidered paused when no events have passed
 * through, playing when true passes through, and paused when false passes
 * through
 */
export type Playing=Subject<boolean>
/**
 * A container for sprites, often used as a level
 */
export abstract class Stage {
	/** Where the sprites are to be stored **/
	sprites:Sprites={}
	/** Where the collections are to be stored **/
	collections:Collections={}

	/** The reference to the input handler */
	abstract input:Input

	/** The reference to the renderer engine */
	abstract renderer:Renderer
	/** optional information on how to render this stage */
	//renderInfo?:RenderInfo//TODO: either make a variation of these for stages specificly, &/or make them required

	/** The reference to the physics engine */
	abstract physics:Physics
	/** optional information on how to handle physics for this stage */
	//physicsInfo?:PhysicsInfo//TODO: either make a variation of these for stages specificly, &/or make them required

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

