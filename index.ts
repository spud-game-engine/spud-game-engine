export let version:[number,number,number,string?]=[0,0,0]
export let versionStr:string=version.slice(0,3).join(".")
	.concat(version[3]||"")
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
}
/**
 * The abstract parent class of all collider implimentations
 * 
 * A collider serves two tasks:
 * 1. Keep track of all of the sprites, and
 * 2. Detarmine if they are "colliding"
 */
export abstract class Collider {}
/**
 * The abstract parent class of all renderers
 */
export abstract class Renderer {
	constructor(collider:Collider) {
		this.collider=collider;
	}
	collider:Collider;
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
 * A collider where all objects lie exactly in various positions on a grid.
 *
export class Grid_Collider extends Collider {
	private _grid:Sprite[][];
	/**
	* The constructor for the [[Grid_Collider]] class.
         * @param width the number of sprites wide
         * @param height the number of sprites tall
         *
	constructor(width:number,height:number) {
		super();
		this._grid=new Array(height);
		for (let i=0;i<this._grid.length;i++) {
			this._grid[i]=new Array(width);
		}
	}
}//*/
/**
 * The base class for all categories of games to inherit from
 */
export abstract class Game {
	/**
	* Constructor for the [[Game]] base class
        */
	constructor(name:string,
		    renderer:Renderer) {
		console.log(name);
		this.name=name;
		this.renderer=renderer;
	}
	/**
	* The name of the game.
	*/
        name:string;
	/**
	* The component that will display the game objects to the user.
        */
	renderer:Renderer;
}
//TODO: They make the main class, inherit from Game
