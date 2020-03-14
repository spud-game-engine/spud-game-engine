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
suite("Renderer tests",()=>{})//All sub functions are abstract
suite("Physics tests",()=>{})//All sub functions are abstract
suite("Input tests",()=>{})//All sub functions are abstract
suite("Stage tests",()=>{
	test("constructor",()=>{
		assert.doesNotThrow(()=>{
			new BlandStage(
				new BlandRenderer(),
				new BlandPhysics(),
				new BlandInput())
		})
		assert.doesNotThrow(()=>{
			new BlandStage(
				new BlandRenderer(),
				new BlandPhysics(),
				[
					new BlandInput(),
					new BlandInput(),
					new BlandInput()
				])
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

