/** The main file for basic tools used in a platformer */
import * as core from './core'

export abstract class Input extends core.Input{}
export interface RenderInfo extends core.RenderInfo{}
export abstract class Renderer extends core.Renderer{}
export interface PhysicsInfo extends core.PhysicsInfo{
	x:number
	y:number
	snapToGrid?:boolean//"defaults" to false
}
export class Physics extends core.Physics{
	physics_loop() {
		console.log("In the loop!",arguments);
	}
}
export abstract class Sprite extends core.Stage{
	abstract physicsInfo:PhysicsInfo
	/** Move a sprite.
	 * @returns A promise so events can be chained
	 */
	moveTo(x:number,y:number):Promise<null> {
		return new Promise(()=>{
			this.physicsInfo.x=x;
			this.physicsInfo.y=y;
			//TODO: Handle for grid snap
		});
	}
}
export abstract class Collection extends core.Collection{}
export abstract class Stage extends core.Stage{}
export abstract class Game extends core.Game{}

