/* istanbul ignore file */
/// <reference types="intern"/>
//import { Task, Evented, request } from '@theintern/common'
const {suite, test}=intern.getPlugin("interface.tdd")
const { assert }=intern.getPlugin('chai')
import * as core from '../src/core'
class BlandRenderer extends core.Renderer{
	render(){}
}
class BlandPhysics extends core.Physics{
	physics_loop(){}
}
class BlandInput extends core.Input{
	play(){}
	pause(){}
}
class BlandCollection extends core.Collection{}
class BlandStage extends core.Stage{
	play(){}
	pause(){}
}
class BlandSprite extends core.Sprite{
	physicsInfo={}
	renderInfo={}
}
/*suite("library config",()=>{
	/*test("Constructors work",()=>{
		assert.doesNotThrow(()=>{
			new Game()
		})
	})
})*/
suite("Sage tests",()=>{
	test("constructor",()=>{
		assert.doesNotThrow(()=>{
			new BlandStage(
				new BlandRenderer(),
				new BlandPhysics(),
				new BlandInput())
		})
	})
})
suite("Collection tests",()=>{
	test("constructor",()=>{
		assert.doesNotThrow(()=>{
			new BlandCollection(
				new BlandRenderer(),
				new BlandPhysics())
		})
	})
})
suite("Sprite tests",()=>{
	test("constructor",()=>{
		assert.doesNotThrow(()=>{
			new BlandSprite(
				new BlandCollection(
					new BlandRenderer(),
					new BlandPhysics()))
		})
	})
})

