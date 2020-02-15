export interface Playable{
	play():void
	pause():void|number
}
export abstract class SpriteComponent implements Playable{
	get_sprite_info?:()=>any
	set_sprite_info?:(info:any)=>void
	//abstract frame():void
	abstract play():void
	abstract pause():void
}
export abstract class Renderer extends SpriteComponent{}
export abstract class Physics extends SpriteComponent{
	//These might be too implimentation specific
	abstract move(safe:boolean):void
	abstract rotate(safe:boolean):void
}
export abstract class Input implements Playable{
	abstract play():void
	abstract pause():void
	abstract events:{[index:string]:(info:any)=>any}
	abstract trigger:(name:string,info?:any)=>any
}
/**
* An in-game object
*/
export abstract class Sprite implements Playable{
	sprite_info:any={}
	abstract renderer:Renderer[]
	abstract physics:Physics
	play(){
		this.renderer.map((r)=>r.play())
		this.physics.play()
	}
	pause(){
		this.renderer.map((r)=>r.pause())
		this.physics.pause()
	}
}
/**
* A collection of sprites
*/
export abstract class Collection implements Playable {
	abstract sprites:Sprite[]
	abstract collections:Collection[]
	play(){
		this.sprites.map((s)=>s.play());
		this.collections.map((c)=>c.play());
	}
	pause(){
		this.sprites.map((s)=>s.pause());
		this.collections.map((c)=>c.pause());
	}
}
/**
* A container for sprites, often a level
*/
export abstract class Stage extends Collection{
	abstract inputs:Input[]
	play(){
		this.inputs.map((i)=>i.play())
		super.play();
	}
	pause(){
		this.inputs.map((i)=>i.pause())
		super.pause();
	}
}
/**
* The base class for all games
*/
export abstract class Game implements Playable{
	/**
	* Add a stage
	* @param s The stage
	*
	add(s:Stage|Stage[]|{
		[index:string]:Stage,
		[index:number]:Stage,
	}={},name?:string|number) { //TODO: Make overloads instead
		if (s instanceof Stage) {
			if(typeof name!=="undefined") this.stages[name]=s
			else throw "Must supply name!"
			if (this.stageID==-1) this.stageID=name;
		}else if(typeof name!=="undefined") throw "Name not needed!"
		else for(let i in s) {
			this.stages[i]=s[i]//Allow for overriding
			if (this.stageID==-1) this.stageID=i;
		}
	}*/

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
		//return this
	}
	/**
	* Pause the game
	*/
	pause() {
		this.stages[this.stageID].pause()
		//return this
	}
}

