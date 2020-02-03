export let version:[number,number,number,string?]=[0,0,0]
export let versionStr:string=version.slice(0,3).join(".").concat(version[3]||"")
console.log("Welcome to Spud Game Engine v"+versionStr+"!")
/**
* The abstract parent class of all variety of sprites
*/
export abstract class Sprite {
	/**
	* An array of all of the dementions (x, y, z...) and their properties
	* (position, speed, velocity, acceleration...)
	*/
	abstract location:number[][];
	abstract eventStart(info:EventInfo):void;
	abstract eventEnd(info:EventInfo):void;
	abstract inputEventStart(info:EventInfo):void;
	abstract inputEventEnd(info:EventInfo):void;
	abstract connectEvent(info:EventInfo):void;
	abstract disconnectEvent(info:EventInfo):void;
}
export interface EventInfo{}
/**
* Handle for input
*/
export abstract class InputHandler {
	abstract registerEventStart:(handler:(info:EventInfo)=>void)=>void;
	abstract registerEventEnd:(handler:(info:EventInfo)=>void)=>void;
	abstract registerInputEventStart:(handler:(info:EventInfo)=>void)=>void;
	abstract registerInputEventEnd:(handler:(info:EventInfo)=>void)=>void;
	abstract registerConnectEvent:(handler:(info:EventInfo)=>void)=>void;
	abstract registerDisconnectEvent:(handler:(info:EventInfo)=>void)=>void;
}
/**
* The abstract parent class of all collider implimentations
*/
export abstract class Physics {}
/**
* The abstract parent class of all renderers
*/
export abstract class Renderer {
	/**
	* Update the game state. This can include things such as checking for
	* physics events, updating animation frames, music, sound effects,
	* checking keybindings, and more.
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
/**
 * A container for Sprites that manages rendering and physics
 */
export abstract class Stage {
	constructor(renderer:Renderer,physics:Physics) {
		this.renderer=renderer;
		this.physics=physics;
		this.sprites=[];
	}
	sprites:Sprite[];
	/**
	* The component that will display the game objects to the user.
	*/
	renderer:Renderer;
	/**
	* The component that sets the rules for how sprites can interact with oneanother.
	*/
	physics:Physics;
	eventStart(info:EventInfo) {
		for(let i in this.sprites) {
			this.sprites[i].eventStart(info);
		}
	}
	eventEnd(info:EventInfo) {
		for(let i in this.sprites) {
			this.sprites[i].eventEnd(info);
		}
	}
	inputEventStart(info:EventInfo) {
		for(let i in this.sprites) {
			this.sprites[i].inputEventStart(info);
		}
	}
	inputEventEnd(info:EventInfo) {
		for(let i in this.sprites) {
			this.sprites[i].inputEventEnd(info);
		}
	}
	connectEvent(info:EventInfo) {
		for(let i in this.sprites) {
			this.sprites[i].connectEvent(info);
		}
	}
	disconnectEvent(info:EventInfo) {
		for(let i in this.sprites) {
			this.sprites[i].disconnectEvent(info);
		}
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
			//handlers[i].registerEventStart(this.eventStart);
			//handlers[i].registerEventEnd(this.eventEnd);

			handlers[i].registerInputEventStart(this.inputEventStart);
			handlers[i].registerInputEventEnd(this.inputEventEnd);

			handlers[i].registerConnectEvent(this.connectEvent);
			handlers[i].registerDisconnectEvent(this.disconnectEvent);
		}
		this.stage=this.initStage(0);
		this.stage.renderer.render_next_frame();
	}
	eventStart(info:EventInfo) {
		this.stage.eventStart(info);
	}
	eventEnd(info:EventInfo) {
		this.stage.eventEnd(info);
	}
	inputEventStart(info:EventInfo) {
		this.stage.inputEventStart(info);
	}
	inputEventEnd(info:EventInfo) {
		this.stage.inputEventEnd(info);
	}
	connectEvent(info:EventInfo) {
		this.stage.connectEvent(info);
	}
	disconnectEvent(info:EventInfo) {
		this.stage.disconnectEvent(info);
	}
	/**
	* Initialize a stage by index
	*/
	abstract initStage(n:number):Stage;
	/**
	* The current stage, null if not initialized yet
	*/
	private stage:Stage;
}
