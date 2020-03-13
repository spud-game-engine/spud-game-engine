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
	abstract render(sprite:Sprite):void
	/** Bind a given sprite to call [[__frame]] on the `"render"` event */
	/*attach(sprite:Sprite) {
		sprite.renderer=this;
		//sprite.render=()=>this.__frame(sprite);//TODO: Improove
	}*/
}
export interface Move{
	to(...location:number[]):Move
	by(...location:number[]):Move
}
export interface PhysicsInfo{
	/*
	move(params:{
		safe:boolean
	}):Move
    */
}
export abstract class Physics{
	abstract physics_loop(sprite:Sprite):void
	/** Bind a given sprite to call [[__frame]] on the `"physics"` event */
	/*attach(sprite:Sprite){
		sprite.physics_loop=()=>this.__frame(sprite);
	}*/
}
/**
* An in-game object
*/
export abstract class Sprite{ 
	constructor(collection:Collection){
		this.renderer=collection.renderer
		//collection.physics.attach(this);//TODO: make good again
		this.physics=collection.physics
	}
	abstract renderInfo:RenderInfo
	abstract physicsInfo:PhysicsInfo
	renderer:Renderer
	physics:Physics
	render() {
		return this.renderer.render(this);
	}
	//physics_loop:()=>void=()=>undefined
	physics_loop() {
		return this.physics.physics_loop(this)
	}
	//TODO: add move again
	/*move(params:{
		safe:boolean
	}={
		safe:true
	}):Move{
		return this.physicsInfo.move(params);
	}
	*/
}
/**
* A collection of sprites
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
/**
* A container for sprites, often a level
*/
export abstract class Stage extends Collection{
	constructor(renderer:Renderer,physics:Physics,input:Input|Input[]){
		super(renderer,physics)
		if(input instanceof Input) input=[input];
		this.inputs=input;
	}
	inputs:Input[]
	/** To be called on every frame of the game loop */
	frame() {
		this.render();
		this.physics_loop();
	}
	render:()=>void=()=>undefined
	physics_loop:()=>void=()=>undefined
	//private interval:number=-1;
	//private __playing=false;
	/** Play the stage
	 * Call inputs[].play. Also start calling this.frame regularrally
	 */
   	abstract play():void
	/*play(){
		this.inputs.map((i)=>i.play())
		this.__playing=true;
		let loop =async (iteration:number,stop:()=>void)=>{
			if (!this.__playing) {
				//This log was literally put here to appease the great linter gods
				console.log(`Stopped at iteration ${iteration}`);
				return stop()
			}
			this.rendererFrame()
			this.physicsFrame()
		}
		interval(loop,1000/80);//TODO: let them decide the frequency?
		/*
		this.interval=window.setInterval(()=>{//TODO: Not a great fix
			//we may want these two to be on different intervals
			this.rendererFrame();
			this.physicsFrame();
		},1000/80);
	    *
	}*/
	/** Pause the stage
	 * Call inputs[].pause. Also stop auto calling this.frame
	 */
	abstract pause():void
	/*pause(){
		this.__playing=false;
	}*/
}
/**
* The base class for all games
*/
export abstract class Game{
	/**
	* The current stage
	*/
	stageID:number|string=-1;
	/**
	* All stages
	*/
	stages:{[index:string]:Stage}={};
	/**
	* Play the game
	* @param id If supplied, sets [[stageID]]
	*/
	play(id?:number|string) {
		if (typeof id!="undefined") this.stageID=id;
		this.stages[this.stageID].play()
	}
	/**
	* Pause the game
	*/
	pause() {
		this.stages[this.stageID].pause()
	}
}

