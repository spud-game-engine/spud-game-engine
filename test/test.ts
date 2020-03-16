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
suite("Renderer",()=>{})//All sub functions are abstract
suite("Physics",()=>{})//All sub functions are abstract
suite("Input",()=>{})//All sub functions are abstract
suite("Stage",()=>{
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
suite("Collection",()=>{
	test("constructor",()=>{
		assert.doesNotThrow(()=>{
			new BlandCollection(
				new BlandRenderer(),
				new BlandPhysics())
		})
	})
	/** Does Collection.render properly call Renderer.render? */
	test("render renderer",()=>{
		let leftover=5
		class CustomRenderer extends core.Renderer {
			render() {
				leftover--
			}
		}
		let unclean=0
		class CustomPhysics extends core.Physics {
			physics_loop() {
				unclean++
			}
		}
		let s=new BlandCollection(
				new CustomRenderer(),
				new CustomPhysics())
		s.render()
		s.render()
		s.render()
		s.render()
		s.render()
		assert.equal(0,leftover)
		assert.equal(0,unclean)
	})
	test("render sprites",()=>{
		let leftover=5*5 // 5 times called, 5 sprites
		class CustomSprite extends core.Sprite{
			physicsInfo={}
			renderInfo={}
			render() {
				leftover--;
				return super.render();//in this context, not really needed, but it is good to have
			}
		}
		let s=new BlandCollection(
				new BlandRenderer(),
				new BlandPhysics())

		for(let i=1;i<5;i++) {
			s.sprites[i]=new CustomSprite(s);
		}

		s.sprites["Billy bob joe"]=new CustomSprite(s)

		s.render()
		s.render()
		s.render()
		s.render()
		s.render()
		assert.equal(0,leftover)
	})
	test("render collections",assert.fail)
	/** Does Collection.physics_loop properly call Physics.physics_loop? */
	test("physics_loop physics",()=>{
		let unclean=0
		class CustomRenderer extends core.Renderer {
			render() {
				unclean++
			}
		}
		let leftover=5
		class CustomPhysics extends core.Physics {
			physics_loop() {
				leftover--
			}
		}
		let s=new BlandCollection(
				new CustomRenderer(),
				new CustomPhysics())
		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		assert.equal(0,leftover)
		assert.equal(0,unclean)
	})
	test("physics_loop sprites&collections",()=>{
		let leftover=5*5 // 5 times called, 5 sprites
		class CustomSprite extends core.Sprite{
			physicsInfo={}
			renderInfo={}
			physics_loop() {
				leftover--;
				return super.physics_loop();//in this context, not really needed, but it is good to have
			}
		}
		let s=new BlandCollection(
				new BlandRenderer(),
				new BlandPhysics())

		for(let i=1;i<5;i++) {
			s.sprites[i]=new CustomSprite(s);
		}
		s.sprites["Billy bob joe"]=new CustomSprite(s)

		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		assert.equal(0,leftover)
	})
	test("physics_loop collections",assert.fail)
})
suite("Sprite",()=>{
	test("constructor",()=>{
		assert.doesNotThrow(()=>{
			new BlandSprite(
				new BlandCollection(
					new BlandRenderer(),
					new BlandPhysics()))
		})
	})
	/** Does Sprite.render properly call Renderer.render? */
	test("render",()=>{
		let leftover=5
		class CustomRenderer extends core.Renderer {
			render() {
				leftover--
			}
		}
		let unclean=0
		class CustomPhysics extends core.Physics {
			physics_loop() {
				unclean++
			}
		}
		let s=new BlandSprite(
			new BlandCollection(
				new CustomRenderer(),
				new CustomPhysics()))
		s.render()
		s.render()
		s.render()
		s.render()
		s.render()
		assert.equal(0,leftover)
		assert.equal(0,unclean)
	})
	/** Does Sprite.physics_loop properly call Physics.physics_loop? */
	test("physics_loop",()=>{
		let unclean=0
		class CustomRenderer extends core.Renderer {
			render() {
				unclean++
			}
		}
		let leftover=5
		class CustomPhysics extends core.Physics {
			physics_loop() {
				leftover--
			}
		}
		let s=new BlandSprite(
			new BlandCollection(
				new CustomRenderer(),
				new CustomPhysics()))
		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		s.physics_loop()
		assert.equal(0,leftover)
		assert.equal(0,unclean)
	})
})

