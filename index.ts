export let version:[number,number,number,string?]=[0,0,0]
export let versionStr:string=version.slice(0,3).join(".").concat(version[3]||"")
console.log("Welcome to Spud Game Engine v"+versionStr+"!")
//let totalNumberOfSprites=0;
/**
* The abstract parent class of all variety of sprites
*/
export abstract class Sprite {
	constructor() {
		this.location=[]
		this.rotation=[]
	}
	/**An array of the location values (x,y,z...) */
	location:number[];
	/**An array of the rotation values (x,y,z...) */
	rotation:number[];

	//abstract eventStart(info:EventInfo):void;
	//abstract eventEnd(info:EventInfo):void;
	/**
	* An event triggered when user input starts (ex: a keydown event)
	*/
	inputEventStart(info:EventInfo) {console.log(info)}
	/**
	* An event triggered when user input ends (ex: a keyup event)
	*/
	inputEventEnd(info:EventInfo) {console.log(info)}
	/**
	* An event triggered when a new source of user input is connected
	*/
	connectEvent(info:EventInfo) {console.log(info)}
	/**
	* An event triggered when a source of user input is disconnected
	*/
	disconnectEvent(info:EventInfo) {console.log(info)}
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
export interface EventInfo{} //TODO
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
/**
* The abstract parent class of all collider implimentations
*/
export abstract class Physics extends Resumable{}
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
		for(let i in handlers) {
			handlers[i].inputEventStart=this.inputEventStart;
			handlers[i].inputEventEnd=this.inputEventEnd;

			handlers[i].connectEvent=this.connectEvent;
			handlers[i].disconnectEvent=this.disconnectEvent;
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
	 * Pause or play this stage
	 */
	play() {
		this.renderer.play() //does the order matter?
		this.physics.play()
	}
	pause() {
		this.physics.pause() //does the order matter?
		this.renderer.pause()
	}
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
	constructor(s:Stage|Stage[]|{
		[index:string]:Stage,
		[index:number]:Stage,
	}={},name?:string|number) {
		this.add(s,name)
	}
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
		}else if(typeof name!=="undefined") throw "Name not needed!"
		else for(let i in s)
			this.stages[i]=s[i]//Allow for overriding
	}

	/**
	* An event triggered when user input starts (ex: a keydown event)
	*/
	inputEventStart(info:EventInfo) {
		this.stages[0].inputEventStart(info);
	}
	/**
	* An event triggered when user input ends (ex: a keyup event)
	*/
	inputEventEnd(info:EventInfo) {
		this.stages[0].inputEventEnd(info);
	}
	/**
	* An event triggered when a new source of user input is connected
	*/
	connectEvent(info:EventInfo) {
		this.stages[0].connectEvent(info);
	}
	/**
	* An event triggered when a source of user input is disconnected
	*/
	disconnectEvent(info:EventInfo) {
		this.stages[0].disconnectEvent(info);
	}
	/**
	* Immediately init and set the stage
	*/
	changeToStage(n:number|string) {
		this.stages[this.stageID].pause()
		this.stageID=n;
		this.stages[this.stageID].play()
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
		this.stages[this.stageID].play()
		return this
	}
}
