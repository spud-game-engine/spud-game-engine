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
class BlandStage extends core.Stage{}
class BlandSprite extends core.Sprite{
	physicsInfo={}
	renderInfo={}
}
class BlandGame extends core.Game{}

export default function() {
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
		test("play",()=>{//TODO: test that it calls play on everything that a collection would
			let leftover=5
			class CustomInput extends core.Input {
				play() {
					leftover--
				}
				pause() {}
			}
			let b=new BlandStage(
				new BlandRenderer(),
				new BlandPhysics(),
				new CustomInput())
			b.play();
			b.play();
			b.play();
			b.play();
			b.play();
			assert.equal(leftover,0)
		})
		test("pause",()=>{
			let leftover=5
			class CustomInput extends core.Input {
				play() {}
				pause() {
					leftover--
				}
			}
			let b=new BlandStage(
				new BlandRenderer(),
				new BlandPhysics(),
				new CustomInput())
			b.pause();
			b.pause();
			b.pause();
			b.pause();
			b.pause();
			assert.equal(leftover,0)
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
		suite("render",()=>{
			test("renderer",()=>{
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
			test("sprites",()=>{
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

				for(let i=1;i < 5;i++) {
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
			test("collections",()=>{
				let leftover=5*5 // 5 times called, 5 collections
				class CustomCollection extends core.Collection{
					render() {
						leftover--;
						return super.render();//in this context, not really needed, but it is good to have
					}
				}
				let s=new BlandCollection(
						new BlandRenderer(),
						new BlandPhysics())

				for(let i=1;i < 5;i++) {
					s.collections[i]=new CustomCollection(s.renderer,s.physics);
				}

				s.collections["Billy bob joe"]=new CustomCollection(s.renderer,s.physics);

				s.render()
				s.render()
				s.render()
				s.render()
				s.render()
				assert.equal(0,leftover)
			})
		})
		/** Does Collection.physics_loop properly call Physics.physics_loop? */
		suite("physics_loop",()=>{
			test("physics",()=>{
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
			test("sprites",()=>{
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

				for(let i=1;i < 5;i++) {
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
			test("collections",()=>{
				let leftover=5*5 // 5 times called, 5 collections
				class CustomCollection extends core.Collection{
					physics_loop() {
						leftover--;
						return super.physics_loop();//in this context, not really needed, but it is good to have
					}
				}
				let s=new BlandCollection(
						new BlandRenderer(),
						new BlandPhysics())

				for(let i=1;i < 5;i++) {
					s.collections[i]=new CustomCollection(s.renderer,s.physics);
				}

				s.collections["Billy bob joe"]=new CustomCollection(s.renderer,s.physics);

				s.physics_loop()
				s.physics_loop()
				s.physics_loop()
				s.physics_loop()
				s.physics_loop()
				assert.equal(0,leftover)
			})
		})
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
	suite("Game",()=>{
		test("constructor",()=>{
			assert.doesNotThrow(()=>{
				new BlandGame();
			})
		})
		suite("play & pause",()=>{
			test("no args",()=>{
				let leftoverPlay=5;
				let leftoverPause=5;
				class CustomStage extends core.Stage{
					constructor() {
						super(
							new BlandRenderer(),
							new BlandPhysics(),
							new BlandInput())
					}
					play() {
						leftoverPlay--;
						super.play()
					}
					pause() {
						leftoverPause--;
						super.pause()
					}
				}
				let b=new BlandGame();
				b.stages["lol"]=new CustomStage();
				b.stageID="lol";
				b.play();b.pause();
				b.play();b.pause()
				b.play();b.pause()
				b.play();b.pause()
				b.play();b.pause()
				assert.equal(leftoverPlay,0,"Number of times play was triggered");
				assert.equal(leftoverPause,0,"Number of times pause was triggered");
			})
			test("with args",()=>{
				let leftoverPlay=5;
				let leftoverPause=5;
				class CustomStage extends core.Stage{
					constructor() {
						super(new BlandRenderer(),new BlandPhysics(),new BlandInput())
					}
					play() {
						leftoverPlay--;
						super.play()
					}
					pause() {
						leftoverPause--;
						super.pause()
					}
				}
				let b=new BlandGame();
				for(let i=0;i <5;i++){
					b.stages[i]=new CustomStage();
				}
				for(let i=0;i <5;i++){
					b.play(Math.round(Math.random()*4));
					b.pause();
				}
				assert.equal(leftoverPlay,0,"Number of times play was triggered");
				assert.equal(leftoverPause,0,"Number of times pause was triggered");
			})
		})
	})
}

