export let version:[number,number,number,string?]=[0,0,0]
export let versionStr:string=version.slice(0,3).join(".").concat(version[3]||"")
console.log("Welcome to Spud Game Engine v"+versionStr+"!")
/**
* The abstract parent class of all variety of sprites
*/
export abstract class Sprite {
	/**
	* The X-position of the sprite.
	*/
	x=0
	/**
	* The Y-position of the sprite.
	*/
	y=0
	//abstract eventStart(info:EventInfo):void;
	//abstract eventEnd(info:EventInfo):void;
	/**
	* An event triggered when user input starts (ex: a keydown event)
	*/
	abstract inputEventStart(info:EventInfo):void;
	/**
	* An event triggered when user input ends (ex: a keyup event)
	*/
	abstract inputEventEnd(info:EventInfo):void;
	/**
	* An event triggered when a new source of user input is connected
	*/
	abstract connectEvent(info:EventInfo):void;
	/**
	* An event triggered when a source of user input is disconnected
	*/
	abstract disconnectEvent(info:EventInfo):void;
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
	/**
	* Update the game state. This can include things such as checking
	* for physics events, updating animation frames, music, sound
	* effects, checking keybindings, and more.
	*/
	abstract prepare_next_frame:()=>undefined;
	/**
	* Display the current game state (frame) to the user.
	*/
	abstract render_current_frame:()=>undefined;
	/**
	* Prepare then immediately render the next frame
	*/
	render_next_frame() {
		this.prepare_next_frame();
		this.render_current_frame();
	}
}
export interface Change{
	moveTo:(...args:number[])=>void;
	safeMoveTo:(...args:number[])=>void;
	set:(obj:{},duration?:number)=>void;
}
/**
* A container for Sprites that manages rendering and physics
*/
export abstract class Stage {
	constructor(renderer:Renderer,physics:Physics) {
		this.renderer=renderer;
		this.physics=physics;
	}
	/**
	* Iterate through the sprites
	*/
	abstract mapOnSprites:(callback:(sprite:Sprite)=>void)=>void;
	/**
	* Add a sprite
	* @return The sprite's ID number
	*/
	abstract add:(sprite:Sprite)=>number
	/**
	* Get sprite by it's ID number
	*/
	abstract getByID(id:number):Sprite;
	/**
	* Change things about a sprite, such as where it is
        */
	abstract change:(id:number)=>Change;
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
	/**
	* Constructor for the [[Game]] base class
	*/
	constructor(handlers:InputHandler[]) {
		for(let i in handlers) {
			handlers[i].inputEventStart=this.inputEventStart;
			handlers[i].inputEventEnd=this.inputEventEnd;

			handlers[i].connectEvent=this.connectEvent;
			handlers[i].disconnectEvent=this.disconnectEvent;
		}
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
