/* istanbul ignore file */
/// <reference types="intern"/>
//import { Task, Evented, request } from '@theintern/common'
const {suite, test}=intern.getPlugin("interface.tdd")
const { assert }=intern.getPlugin('chai')
import * as core from '../src/core'

class BlandRenderer extends core.Renderer{
	render_loop(){}
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
		test("play",()=>{
			let leftover=5
			class CustomCollection extends core.Collection {
				constructor(renderer:core.Renderer,physics:core.Physics,parentCollection:core.Collection){
					super(renderer,physics,parentCollection)
					this.playing=parentCollection.playing
					this.playing.subscribe({
						next(val:boolean){
							if(val) leftover--;
						}
					})
				}
			}
			class CustomStage extends core.Stage {
				constructor(renderer:core.Renderer,physics:core.Physics,input:core.Input){
					super(renderer,physics,input)
					this.collections[0]=new CustomCollection(renderer,physics,this)
				}
			}
			let c=new CustomStage(
				new BlandRenderer(),
				new BlandPhysics(),
				new BlandInput());
			c.play();
			c.play(true);
			c.pause(false);
			c.play()
				.play();
			assert.equal(leftover,0)
		})
		test("play",()=>{
			let leftover=5
			class CustomCollection extends core.Collection {
				constructor(renderer:core.Renderer,physics:core.Physics,parentCollection:core.Collection){
					super(renderer,physics,parentCollection)
					this.playing=parentCollection.playing
					this.playing.subscribe({
						next(val:boolean){
							if(!val) leftover--;
						}
					})
				}
			}
			class CustomStage extends core.Stage {
				constructor(renderer:core.Renderer,physics:core.Physics,input:core.Input){
					super(renderer,physics,input)
					this.collections[0]=new CustomCollection(renderer,physics,this)
				}
			}
			let c=new CustomStage(
				new BlandRenderer(),
				new BlandPhysics(),
				new BlandInput());
			c.pause();
			c.pause(true);
			c.play(false);
			c.pause()
				.pause();
			assert.equal(leftover,0)
		})
		/** Test to see if instances of [[core.Input]] can effect other things */
		test("input events",()=>{
			assert.fail("Test not written yet")
		})
	})
	suite("Collection",()=>{
		sute("constructor",()=>{
			test("normal",()=>{
				assert.doesNotThrow(()=>{
					new BlandCollection(
						new BlandRenderer(),
						new BlandPhysics())
				})
			})
			test("array of renderers",()=>{
				assert.doesNotThrow(()=>{
					new BlandCollection(
						[
							new BlandRenderer(),
							new BlandRenderer()
						],
						new BlandPhysics())
				})
			})
			test("array of physics",()=>{
				assert.doesNotThrow(()=>{
					new BlandCollection(
						new BlandRenderer(),
						[
							new BlandPhysics(),
							new BlandPhysics()
						]
					)
				})
			})
		})
		/** Does Collection.render properly call Renderer.render? */
		suite("render_loop",()=>{
			test("renderer",()=>{
				let leftover=5
				class CustomRenderer extends core.Renderer {
					attach(collection:core.Collection){
						collection.playing.subscribe({
							"next":(val:boolean)=>{
								if(val)leftover--;
							}
						})
					}
				}
				let s=new CustomCollection(
					new CustomRenderer(),
					new BlandPhysics())
				s.play()
				s.play()
				s.play()
				s.play()
				s.play()
				assert.equal(0,leftover)
			})
			test("sprites",()=>{
				let leftover=5*5 // 5 times called, 5 sprites
				class CustomSprite extends core.Sprite{
					physicsInfo={}
					renderInfo={}
					render_loop() {
						leftover--;
						return super.render_loop();//in this context, not really needed, but it is good to have
					}
				}
				let s=new BlandCollection(
						new BlandRenderer(),
						new BlandPhysics())

				for(let i=1;i < 5;i++) {
					s.sprites[i]=new CustomSprite(s);
				}

				s.sprites["Billy bob joe"]=new CustomSprite(s)

				s.render_loop()
				s.render_loop()
				s.render_loop()
				s.render_loop()
				s.render_loop()
				assert.equal(0,leftover)
			})
			test("collections",()=>{
				let leftover=5*5 // 5 times called, 5 collections
				class CustomCollection extends core.Collection{
					render_loop() {
						leftover--;
						return super.render_loop();//in this context, not really needed, but it is good to have
					}
				}
				let s=new BlandCollection(
						new BlandRenderer(),
						new BlandPhysics())

				for(let i=1;i < 5;i++) {
					s.collections[i]=new CustomCollection(s.renderer,s.physics);
				}

				s.collections["Billy bob joe"]=new CustomCollection(s.renderer,s.physics);

				s.render_loop()
				s.render_loop()
				s.render_loop()
				s.render_loop()
				s.render_loop()
				assert.equal(0,leftover)
			})
			test("call order",()=>assert.fail("Test not written yet..."))
		})
		/** Does Collection.physics_loop properly call Physics.physics_loop? */
		suite("physics_loop",()=>{
			assert.fail("Needs conversion to subscriptions")
			test("physics",()=>{
				let unclean=0
				class CustomRenderer extends core.Renderer {
					render_loop() {
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
		test("render_loop",()=>{
			assert.fail("Needs conversion to subscriptions")
			let leftover=5
			class CustomRenderer extends core.Renderer {
				render_loop() {
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
			s.render_loop()
			s.render_loop()
			s.render_loop()
			s.render_loop()
			s.render_loop()
			assert.equal(0,leftover)
			assert.equal(0,unclean)
		})
		/** Does Sprite.physics_loop properly call Physics.physics_loop? */
		test("physics_loop",()=>{
			assert.fail("Needs conversion to subscriptions")
			let unclean=0
			class CustomRenderer extends core.Renderer {
				render_loop() {
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
			assert.fail("Needs conversion to subscriptions")
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
			test("auto pauses",()=>{
				let playing=false;
				class CustomStage extends core.Stage{
					constructor(){
						super(new BlandRenderer(),new BlandPhysics(),new BlandInput())
					}
					play() {
						super.play()
						playing=true;
					}
					pause() {
						super.pause()
						playing=false;
					}
				}
				assert.isFalse(playing)
				let g=new BlandGame();
				g.stages["first"]=new CustomStage()
				g.stages["next"]=new BlandStage(new BlandRenderer(),new BlandPhysics(),new BlandInput())
				g.play("first")
				assert.isTrue(playing)
				g.play("next")
				assert.isFalse(playing)
			})
		})
	})
}

