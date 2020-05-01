/* istanbul ignore file */
/// <reference types="intern"/>
//import { Task, Evented, request } from '@theintern/common'
const {suite, test}=intern.getPlugin("interface.tdd")
const { assert }=intern.getPlugin('chai')
import { Subject } from 'rxjs';
import * as core from '../src/core'

//TODO: Inputs must have a subject of type `Subject<[string,Observeable<InputInfo>]>` or something like that where the passed observable completes at the end of the input event

class BlandRenderer extends core.Renderer{
	attach(){}
}
class BlandPhysics extends core.Physics{
	physics_loop(){}
}
class BlandInput extends core.Input{
	play(){}
	pause(){}
}
class BlandCollection extends core.Collection{
	playing=new Subject<boolean>()
	physics_loop=new Subject<core.PhysicsActor>()
	render_loop=new Subject<core.RendererActor>()
}
//class BlandStage extends core.Stage{}
class BlandSprite extends core.Sprite{
	physicsInfo={}
	renderInfo={}
}
//class BlandGame extends core.Game{}

export default function() {
	suite("Renderer",()=>{})//All sub functions are abstract //TODO: this is a horrible reason to not write tests
	suite("Physics",()=>{})//All sub functions are abstract
	suite("Input",()=>{})//All sub functions are abstract
	suite("Stage",()=>{
		return;//TODO: stage class is probabbly useless
		/*
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
					]
				)
			})
		})
		suite("subclass",()=>{
			suite("smallest possible",()=>{
				test("done right",()=>{
					class CustomCollection extends core.Collection{
						constructor() {
							super(new BlandRenderer(),new BlandPhysics())
							this.playing=new Subject(()=>{}) // Required
						}
					}
					assert.doesNotThrow(()=>{
						new CustomCollection()
					})
				})
				test("smallest without playing Subject",()=>{
					//It's possible that this might not even compile. If that's the case, then this test is useless
					assert.throws(()=>{
						class CustomCollection extends core.Collection{
							constructor() {
								super(new BlandRenderer(),new BlandPhysics())
							}
						}
						new CustomCollection()
					})
				})
			})
			suite("with parentCollection",()=>{
				test("done right",()=>{
					class CustomCollection extends core.Collection{
						constructor() {
							super(new BlandRenderer(),new BlandPhysics(),new BlandCollection(new BlandRenderer(),new BlandPhysics()))
							this.playing=new Subject(()=>{}) // Required
						}
					}
				})
				test("smallest without playing Subject",()=>{
					//It's possible that this might not even compile. If that's the case, then this test is useless
					assert.throws(()=>{
						class CustomCollection extends core.Collection{
							constructor() {
								super(new BlandRenderer(),new BlandPhysics(),new BlandCollection(new BlandRenderer(),new BlandPhysics()))
							}
						}
						new CustomCollection()
					})
				})
			})
		})
		test("play",()=>{
			let leftover=5
			class CustomCollection extends core.Collection {
				constructor(renderer:core.Renderer,physics:core.Physics,parentCollection:core.Collection){
					super(renderer,physics,parentCollection)
					this.playing=parentCollection.playing
					this.playing.subscribe((val:boolean)=>{
						if(val) leftover--;
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
			c.play() //TODO: do we _really_ want to be able to do this?
				.play();
			assert.equal(leftover,0)
		})
		test("pause",()=>{
			let leftover=5
			class CustomCollection extends core.Collection {
				constructor(renderer:core.Renderer,physics:core.Physics,parentCollection:core.Collection){
					super(renderer,physics,parentCollection)
					this.playing=parentCollection.playing //This is required
					this.playing.subscribe((val:boolean)=>{
						if(!val) leftover--;
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
		/** Test to see if instances of [[core.Input]] can effect other things *
		suite("input events",()=>{
			class CustomInput extends core.Input {
				attach(collection:core.Collection) {
					super.attach(collection) //TODO: throws if called twice
					collection.playing.subscribe((val:boolean)=>{
						if (val) {
							for(let i=0;i <5;i++) {
								this.trigger({ // TODO: verify This is the exact object received in the start subscription
									type:"",
									device:"",
									startTime:new Date(),
									code:0,
									value:1
								})
							}
						}
					})
				}
			}
			test("effects stage",()=>{
				let leftover=5
				class CustomStage extends core.Stage {
					constructor() {
						super(
							new BlandRenderer(),
							new BlandPhysics(),
							new CustomInput())
						this.inputs[0].start.subscribe((val:core.InputInfo)=>{
							leftover--
						})
					}
				}
				new CustomStage().play()
				assert.equal(leftover,0)
			})
			test("effects bound sprites",()=>{
				assert.fail("Test not written yet")//TODO: write test
				let leftover=5
				class CustomSprite extends core.Sprite{
					constructor(collection:core.Collection){
						super(collection)
						collection.inputs.map()// TODO: perhaps we don't need the stage class then....
					}
				}
				class CustomStage extends core.Stage {
					constructor() {
						super(
							new BlandRenderer(),
							new BlandPhysics(),
							new CustomInput())
						this.sprites[0]=new CustomSprite(this)
						this.inputs[0].start.subscribe((val:core.InputInfo)=>{
							leftover--
						})
					}
				}
				new CustomStage().play()
				assert.equal(leftover,0)
			})
			test("effects bound collections",()=>{
				assert.fail("Test not written yet")//TODO: write test
			})
		})
		test("render events",()=>{
			assert.fail("Test not written yet")//TODO: write test
		})
		test("physics events",()=>{
			assert.fail("Test not written yet")//TODO: write test
		})
	   	*/
	})
	suite("Collection",()=>{
		suite("constructor",()=>{
			test("acting as child",()=>{
				assert.doesNotThrow(()=>{
					class CustomCollection extends core.Collection{
						playing=new Subject<boolean>()
						physics_loop=new Subject<core.PhysicsActor>()
						render_loop=new Subject<core.RendererActor>()
						renderer=new BlandRenderer()
						physics=new BlandPhysics()
					}
					new BlandCollection(
						new CustomCollection())
				})
				assert.throws(()=>{
					new BlandCollection(
						new BlandCollection())
				})
			})
			test("normal",()=>{
				assert.doesNotThrow(()=>{
					class CustomCollection extends core.Collection{
						playing=new Subject<boolean>()
						physics_loop=new Subject<core.PhysicsActor>()
						render_loop=new Subject<core.RendererActor>()
						renderer=new BlandRenderer()
						physics=new BlandPhysics()
					}
					new CustomCollection()
				})
			})
			/* We might not want these for now...
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
			test("array of physics and renders",()=>{
				assert.doesNotThrow(()=>{
					new BlandCollection(
						[
							new BlandRenderer(),
							new BlandRenderer()
						],
						[
							new BlandPhysics(),
							new BlandPhysics()
						]
					)
				})
			})
		   	*/
		})
		suite("subclass",()=>{
			test("with child collection",()=>{
				class CustomCollection extends core.Collection {
					playing=new Subject<boolean>()
					physics_loop=new Subject<core.PhysicsActor>()
					render_loop=new Subject<core.RendererActor>()
					physics=new BlandPhysics()
					renderer=new BlandRenderer()
					constructor() {
						super()
						this.collections[0]=new BlandCollection(this)
					}
				}
				//TODO: assert something
			})
		})
		suite("render_loop",()=>{
			test("renderer",()=>{
				//TODO: what are we testing here?
				let leftover=5
				class CustomRenderer extends core.Renderer {
					attach(collection:core.Collection){
						collection.playing.subscribe((val:boolean)=>{
							if(val)leftover--;
						})
					}
				}
				class CustomCollection extends core.Collection{
					playing=new Subject<boolean>()
					physics_loop=new Subject<core.PhysicsActor>()
					render_loop=new Subject<core.RendererActor>()
					physics=new BlandPhysics()
					renderer=new CustomRenderer()
				}
				let s=new CustomCollection()
				s.play();
				s.play(true);
				s.pause(false);
				s.play()
				s.play();
				assert.equal(0,leftover)
			})
			test("sprites",()=>{
				let leftover=5*5 // 5 times called, 5 sprites
				class CustomSprite extends core.Sprite{
					physicsInfo={}
					renderInfo={}
					constructor(collection:core.Collection){
						super(collection)
						//Give the renderer back a reference to this object
						collection.render_loop.subscribe((r)=>r(this))
					}
					/*physicsInfo={}
					renderInfo={}
					render_loop() {
						leftover--;
						return super.render_loop();//in this context, not really needed, but it is good to have
					}*/
				}
				let s=new BlandCollection()

				for(let i=1;i < 5;i++) {
					s.sprites[i]=new CustomSprite(s);
				}

				s.sprites["Billy bob joe"]=new CustomSprite(s)

				s.render_loop.next()
				s.render_loop.next()
				s.render_loop.next()
				s.render_loop.next()
				s.render_loop.next()
				assert.equal(0,leftover)
			})
			test("collections",()=>{
				let leftover=5*5 // 5 times called, 5 collections
				class CustomCollection extends core.Collection{
					playing=new Subject<boolean>()
					physics_loop=new Subject<core.PhysicsActor>()
					render_loop=new Subject<core.RendererActor>()
					physics=new BlandPhysics()
					renderer=new BlandRenderer()
					constructor(s?:core.Collection) {
						super(s)
						this.render_loop.subscribe(()=>{
							leftover--;
						})
					}
				}
				let s=new BlandCollection()

				for(let i=1;i < 5;i++) {
					s.collections[i]=new CustomCollection(s);
				}

				s.collections["Billy bob joe"]=new CustomCollection(s);

				s.render_loop.next()
				s.render_loop.next()
				s.render_loop.next()
				s.render_loop.next()
				s.render_loop.next()
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
		/*
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
	   */
	})
}

