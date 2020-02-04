export let version:[number,number,number,string?]=[0,0,0]
export let versionStr:string=version.slice(0,3).join(".").concat(version[3]||"")
console.log("Welcome to Spud Game Engine v"+versionStr+"!")
let totalNumberOfSprites=0;
/**
* The abstract parent class of all variety of sprites
*/
export abstract class Sprite {
	constructor() {
		this.location=[]
		this.rotation=[]
	}
	location:number[];
	rotation:number[];

	//abstract eventStart(info:EventInfo):void;
	//abstract eventEnd(info:EventInfo):void;
	/**
	* An event triggered when user input starts (ex: a keydown event)
	*/
	inputEventStart:(info:EventInfo)=>void=()=>undefined;
	/**
	* An event triggered when user input ends (ex: a keyup event)
	*/
	inputEventEnd:(info:EventInfo)=>void=()=>undefined;
	/**
	* An event triggered when a new source of user input is connected
	*/
	connectEvent:(info:EventInfo)=>void=()=>undefined;
	/**
	* An event triggered when a source of user input is disconnected
	*/
	disconnectEvent:(info:EventInfo)=>void=()=>undefined;
}
export interface EventInfo{}
/**
* Handle for input
*/
export abstract class InputHandler {
	//eventStart:((info:EventInfo)=>void)|null=()=>null;
	//eventEnd:((info:EventInfo)=>void)|null=()=>null;
	/**
	* An event triggered when user input starts (ex: a keydown event)
	*/
	inputEventStart:((info:EventInfo)=>void)|null=()=>null;
	/**
	* An event triggered when user input ends (ex: a keyup event)
	*/
	inputEventEnd:((info:EventInfo)=>void)|null=()=>null;
	/**
	* An event triggered when a new source of user input is connected
	*/
	connectEvent:((info:EventInfo)=>void)|null=()=>null;
	/**
	* An event triggered when a source of user input is disconnected
	*/
	disconnectEvent:((info:EventInfo)=>void)|null=()=>null;
}
/**
* The abstract parent class of all collider implimentations
*/
export abstract class Physics {}
/**
* A tool that lets users "see" the current game state.
*/
export abstract class Renderer {
	constructor(targetFPS:number) {
		this.targetFPS=targetFPS;
	}
	/**
	* The framerate that we will be trying to maintain
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
	* Display the current game state (frame) to the user.
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
	private timeout:number|null=null
	/**
	* Tell the [[Renderer]] to start rendering the game
	* 
	* Resumes if needed.
	*/
	play() {
		this.timeout=setInterval(this.render_next_frame,
			(1/this.targetFPS)/1000);
	}
	/**
	* Tell the [[Renderer]] to pause rendering the game
	*/
	pause() {
		if (this.timeout===null) throw "Can't pause if it wasn't already started!";
		clearInterval(this.timeout);
	}
}
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
export abstract class Stage {
	constructor(renderer:Renderer,physics:Physics,handlers:InputHandler[]) {
		this.renderer=renderer;
		this.physics=physics;
		for(let i in handlers) {
			handlers[i].inputEventStart=this.inputEventStart;
			handlers[i].inputEventEnd=this.inputEventEnd;

			handlers[i].connectEvent=this.connectEvent;
			handlers[i].disconnectEvent=this.disconnectEvent;
		}
		this.sprites=[];
	}
	private sprites:Sprite[];
	/**
	* Iterate through the sprites
	*/
	mapOnSprites(callback:(sprite:Sprite,index:number,array:Sprite[])=>void) {
		this.sprites.map(callback)
	}
	/**
	* Add a sprite
	* @return The sprite's ID number
	*/
	add(sprite:Sprite):number {
		let out=totalNumberOfSprites++;
		// sprite.connectRenderer(this.renderer);
		// sprite.connectPhysics(this.physics);
		this.sprites[out]=sprite;
		return out
	}
	/**
	* Get sprite by it's ID
	*/
	getByID(id:number) {
		return this.sprites[id];
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
	* An event triggered when user input starts (ex: a keydown event)
	*/
	inputEventStart(info:EventInfo) {
		this.mapOnSprites((sprite) => {
			sprite.inputEventStart(info);
		});
	}
	/**
	* An event triggered when user input ends (ex: a keyup event)
	*/
	inputEventEnd(info:EventInfo) {
		this.mapOnSprites((sprite) => {
			sprite.inputEventEnd(info);
		});
	}
	/**
	* An event triggered when a new source of user input is connected
	*/
	connectEvent(info:EventInfo) {
		this.mapOnSprites((sprite) => {
			sprite.connectEvent(info);
		});
	}
	/**
	* An event triggered when a source of user input is disconnected
	*/
	disconnectEvent(info:EventInfo) {
		this.mapOnSprites((sprite) => {
			sprite.disconnectEvent(info);
		});
	}
}
/**
* The base class for all categories of games to inherit from
*/
export abstract class Game {
	constructor(/*renderer:Renderer,physics:Physics,handlers:InputHandler[]*/) {
		//super(renderer,physics,handlers)
		this.stage=this.initStage(0);
		this.stage.renderer.render_next_frame();
		//TODO: Initialize game loop and render loop
	}
	/**
	* An event triggered when user input starts (ex: a keydown event)
	*/
	inputEventStart(info:EventInfo) {
		this.stage.inputEventStart(info);
	}
	/**
	* An event triggered when user input ends (ex: a keyup event)
	*/
	inputEventEnd(info:EventInfo) {
		this.stage.inputEventEnd(info);
	}
	/**
	* An event triggered when a new source of user input is connected
	*/
	connectEvent(info:EventInfo) {
		this.stage.connectEvent(info);
	}
	/**
	* An event triggered when a source of user input is disconnected
	*/
	disconnectEvent(info:EventInfo) {
		this.stage.disconnectEvent(info);
	}
	/**
	* Initialize a stage by index
	*/
	abstract initStage(n:number):Stage;
	/**
	* Immediately init and set the stage
	*/
	changeToStage(n:number) {
		this.stage=this.initStage(n);
	}
	/**
	* The current stage
	*/
	stage:Stage;
}
