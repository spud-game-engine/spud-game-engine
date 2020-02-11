export let version:[number,number,number,string?]=[0,0,0]
export let versionStr:string=version.slice(0,3).join(".").concat(version[3]||"")
console.log("Welcome to Spud Game Engine v"+versionStr+"!")
//let totalNumberOfSprites=0;
/**
* The abstract parent class of all variety of sprites
*/
export abstract class Sprite {
	/**An array of the location values (x,y,z...) */
	location:number[]=[];
	/**An array of the rotation values (x,y,z...) */
	rotation:number[]=[];
	rendererInfo:RendererInfo={}
	physicsInfo:PhysicsInfo={}
	abstract initPhysics():void
}
interface SpriteCollectionObj{
	[index:string]:Sprite,
	[index:number]:Sprite
}
export abstract class SpriteCollection extends Sprite {
	constructor() {
		super()
		this.children={}
	}
	private children:SpriteCollectionObj;
	/**
	* Iterate through the sprites
	*/
	mapOnSprites(callback:(sprite:Sprite,index:number)=>void) {
		//this.children.map(callback)
		let count=0;
		for (let i in this.children)
			callback(this.children[i],count++)
	}
	/**
	* Add a sprite
	*/
	add(children:SpriteCollectionObj|Sprite[]|Sprite={},name?:number|string) {
		if (children instanceof Sprite) {
			if(typeof name!=="undefined") this.children[name]=children
			else throw "Must supply name!"
		}else if(typeof name!=="undefined") throw "Name not needed!"
		else for(let i in children)
			this.children[i]=children[i]//Allow for overriding
	}
	/**
	* Get sprite by it's ID
	*/
	getByID(id:number) {
		return this.children[id];
	}
	/**
	* Change things about a sprite, such as where it is
	*/
	change(id:number):Change{
		let sprite=this.getByID(id);
		return {
			moveTo:(...args)=>{
				// for(let i=0;i<args.length;++i) {
				// 	sprite.location[i][0]=args[i];
				// }
				sprite.location=args;
			},
			//TODO: add this
			/*safeMoveTo:(...args) {
				for(let i=0;i<args.length;++i) {
					sprite.location[i][0]=args[i];
				}
			},*/
		}
	}
}
/**
* A class that can be paused or played
*/
export abstract class Resumable {
	constructor(targetFPS:number) {
		this.targetFPS=targetFPS;
	}
	/**
	* The Iterations Per Second that we will be trying to maintain
	*/
	targetFPS:number;
	/**
	* Update the game state. This can include things such as checking
	* for physics events, updating animation frames, music, sound
	* effects, checking keybindings, and more.
	*/
	prepare_next_frame() {
		throw "TODO: Make this function!"
	}
	/**
	* Apply changes about current frame. In a GUI, this would be sending the
	* user an updated state image.
	*/
	render_current_frame(){
		throw "TODO: Make this function!"
	}
	/**
	* Prepare then immediately render the next frame
	*/
	render_next_frame() {
		this.prepare_next_frame();
		this.render_current_frame();
	}
	/**
	* The number for the current interval
	*/
	private timeout:number|null=null
	/** A reference to the [[SpriteCollection]] that we will be sending signals to */
	collection:SpriteCollection|null=null
	/**
	* Tell the [[Renderer]] to start rendering the game
	*
	* Resumes if needed.
	*/
	play(env?:SpriteCollection) {
		this.timeout=setInterval(this.render_next_frame,
			this.targetFPS/1000);
		if (typeof env!=="undefined") this.collection=env
	}
	/**
	* Tell the [[Renderer]] to pause rendering the game
	*/
	pause() {
		if (this.timeout===null) throw "Can't pause if it wasn't already started!";
		clearInterval(this.timeout);
	}
}
/**
* Handle for input
*/
export abstract class InputHandler extends Resumable {
	constructor() {
		super(1000)
		this.events={}
	}
	events:{[index:string]:((info:KeyboardEvent)=>void)[]}={} //TODO: Don't use [[KeyboardEvent]] here!
	/** Add an event */
	on(name:"inputDown"|"inputUp"|"inputPress",callback:(info:KeyboardEvent)=>any) {
		this.events[name].push(callback)
	}
	/** Remove all events from a given event */
	off(name:"inputDown"|"inputUp"|"inputPress") {
		this.events[name]=[]
	}
	/** Trigger an event */
	trigger(name:"inputDown"|"inputUp"|"inputPress",info:KeyboardEvent):any[] {
		return this.events[name].map((callback)=>callback(info))
	}
}
/** The physics information stored on a sprite */
export interface PhysicsInfo {}
/** The abstract parent class of all physics implimentations.*/
export abstract class Physics extends Resumable{
	play(collection?:SpriteCollection) {
		super.play(collection)
		if (this.collection!==null) this.collection.mapOnSprites((sprite)=>{
			sprite.initPhysics();
			sprite.initPhysics=()=>undefined;//Don't do it again!
		})
	}
}
/** The information stored on a sprite saying how to render this sprite */
export interface RendererInfo {}
/**
* A tool that lets users "see" the current game state.
*/
export abstract class Renderer extends Resumable {}
// export interface ChangeObj {
// 	x?:number;
// 	y?:number;
// 	//z?:number;
// 	location:number[]|number[][];
// }
/**
* The object that is returned by [[Stage.change]].
*
* Seeks to provide a way of changing things about Sprites within a stage
*/
export interface Change{
	moveTo:(...args:number[])=>void;
	//safeMoveTo:(...args:number[])=>void;
	// set:(obj:ChangeObj,duration?:number)=>void;
	// by:(obj:ChangeObj,duration?:number)=>void;
}
/**
* A container for Sprites that manages rendering and physics
*/
export abstract class Stage extends SpriteCollection {
	constructor(renderer:Renderer,physics:Physics,handlers:InputHandler[]) {
		super()
		this.renderer=renderer;
		this.physics=physics;
		this.handlers=handlers
	}
	/**
	* The component that will display the game objects to the user.
	*/
	renderer:Renderer;
	/**
	* The component that sets the rules for how sprites can interact
	* with oneanother.
	*/
	physics:Physics;
	/**
	* A list of all user input handlers for this stage
	*/
	handlers:InputHandler[]
	/**
	* Play this stage
	*/
	play() {
		this.renderer.play(this) //does the order matter?
		this.physics.play(this)
		this.handlers.map((v)=>v.play(this))
	}
	/**
	* Pause this stage
	*/
	pause() {
		this.physics.pause() //does the order matter?
		this.renderer.pause()
		this.handlers.map((v)=>v.pause())
	}
	/*events:EventHost["events"]={}
	on:EventHost["on"]=(name,callback)=>{
		this.events[name].push(callback)
	}
	trigger:EventHost["trigger"]=(name,info)=>
		this.events[name].map((val)=>val(info))
	off:EventHost["off"]=(name)=>{
		this.events[name]=[]
	}*/

}
/**
* The base class for all categories of games to inherit from
*/
export abstract class Game {
	/**
	* Add a stage
	* @param s The stage
	*/
	add(s:Stage|Stage[]|{
		[index:string]:Stage,
		[index:number]:Stage,
	}={},name?:string|number) {
		if (s instanceof Stage) {
			if(typeof name!=="undefined") this.stages[name]=s
			else throw "Must supply name!"
			if (this.stageID==-1) this.stageID=name;
		}else if(typeof name!=="undefined") throw "Name not needed!"
		else for(let i in s) {
			this.stages[i]=s[i]//Allow for overriding
			if (this.stageID==-1) this.stageID=i;
		}
	}

	/**
	* The current stage
	*/
	stageID:number|string=-1;
	/**
	* All stages
	*/
	stages:{
		[index:string]:Stage,
		[index:number]:Stage,
	}={};
	/**
	* Play the game
	*/
	play() {
		this.stages[this.stageID].play()
		return this
	}
	/**
	* Pause the game
	*/
	pause() {
		this.stages[this.stageID].pause()
		return this
	}
}
