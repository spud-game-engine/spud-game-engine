/* istanbul ignore file */
/// <reference types="intern"/>
//import { Task, Evented, request } from '@theintern/common'
const {suite, test}=intern.getPlugin("interface.tdd")
const { assert }=intern.getPlugin('chai')
import { Subject, Observable } from 'rxjs';
import * as core from '../src/core'


class BlandRenderer extends core.Renderer{
	render_loop=new Subject<core.RendererActor>()
}
class BlandPhysics extends core.Physics{
	physics_loop=new Subject<core.PhysicsActor>()
}
class BlandInput extends core.Input{
	event=new Subject<Observable<core.InputInfo>>()
}
class BlandCollection extends core.Collection{}
class BlandStage extends core.Stage{
	playing=new Subject<boolean>()
	physics=new BlandPhysics()
	renderer=new BlandRenderer()
	input=new BlandInput()
}
class BlandSprite extends core.Sprite{
	physicsInfo={}
	renderInfo={}
}
//class BlandGame extends core.Game{}

export default function() {
	suite("Renderer",()=>{})//All sub functions are abstract //TODO: this is a horrible reason to not write tests
	suite("Physics",()=>{})//All sub functions are abstract
	suite("Input",()=>{
		test("subclass",()=>{
			class CustomInput extends core.Input{
				event=new Subject<Observable<core.InputInfo>>()
			}
			class CustomStage extends core.Stage {
				input=new CustomInput()
				physics=new BlandPhysics()
				renderer=new BlandRenderer()
				playing=new Subject<boolean>()
			}
			assert.doesNotThrow(()=>{
				new CustomStage()
			})
		})
		suite("getsPlaying",()=>{
			test("starting",()=>{
				let canPlay:boolean=false
				class CustomInput extends core.Input {
					event=new Subject<Observable<core.InputInfo>>()
					constructor(stage:core.Stage){
						super(stage)
						stage.playing.subscribe((val:boolean)=>{
							canPlay=val
						})
					}
				}
				class CustomStage extends core.Stage {
					playing=new Subject<boolean>()
					input:core.Input=new CustomInput(this)
					physics=new BlandPhysics()
					renderer=new BlandRenderer()
				}
				new CustomStage().play()
				assert.isTrue(canPlay)
			})
			test("stopping",()=>{
				let canPause:boolean=false
				class CustomInput extends core.Input {
					event=new Subject<Observable<core.InputInfo>>()
					constructor(stage:core.Stage){
						super(stage)
						stage.playing.subscribe((val:boolean)=>{
							canPause=!val
						})
					}
				}
				class CustomStage extends core.Stage {
					playing=new Subject<boolean>()
					input:core.Input=new CustomInput(this)
					physics=new BlandPhysics()
					renderer=new BlandRenderer()
				}
				new CustomStage().pause()
				assert.isTrue(canPause)
			})
		})
		test("sends input events",()=>{
			assert.fail("Not written yet")//TODO: write test
		})
	})
	suite("Stage",()=>{
		suite("constructor",()=>{
			test("with child",()=>{
				assert.doesNotThrow(()=>{
					class CustomStage extends core.Stage{
						playing=new Subject<boolean>()
						renderer=new BlandRenderer()
						physics=new BlandPhysics()
						input=new BlandInput()
						constructor(){
							super()
							this.collections[0]=new BlandCollection(this)
						}
					}
					new CustomStage()
				})
			})
			test("without child",()=>{
				assert.doesNotThrow(()=>{
					class CustomStage extends core.Stage{
						playing=new Subject<boolean>()
						renderer=new BlandRenderer()
						physics=new BlandPhysics()
						input=new BlandInput()
					}
					new CustomStage()
				})
			})
		})
		test("starting",()=>{
			let leftover=3
			class ChildCollection extends core.Collection{
				constructor(collection:core.Collection){
					super(collection)

					collection.playing.subscribe((val:boolean)=>{
						if (val) leftover--
					})
				}
			}
			class CustomStage extends core.Stage{
				playing=new Subject<boolean>()
				physics=new BlandPhysics()
				renderer=new BlandRenderer()
				input=new BlandInput()
				constructor(){
					super()

					this.collections[0]=new ChildCollection(this)
				}
			}
			const c = new CustomStage()
			c.play()
			c.play(true)
			c.pause(false)
			assert.equal(leftover,0)
		})
		test("stopping",()=>{
			let leftover=3
			class ChildCollection extends core.Collection{
				constructor(collection:core.Collection){
					super(collection)

					collection.playing.subscribe((val:boolean)=>{
						if (!val) leftover--
					})
				}
			}
			class CustomStage extends core.Stage{
				playing=new Subject<boolean>()
				physics=new BlandPhysics()
				renderer=new BlandRenderer()
				input=new BlandInput()
				constructor(){
					super()

					this.collections[0]=new ChildCollection(this)
				}
			}
			const c = new CustomStage()
			c.pause()
			c.pause(true)
			c.play(false)
			assert.equal(leftover,0)
		})
	})
	suite("Collection",()=>{
		suite("subclass",()=>{
			test("acting as parent of another collection",()=>{
				assert.doesNotThrow(()=>{
					class CustomCollection extends core.Collection{
						constructor(collection:core.Collection){
							super(collection)
							this.collections[0]=new BlandCollection(this)
						}
					}
					class CustomStage extends core.Stage{
						input=new BlandInput()
						physics=new BlandPhysics()
						renderer=new BlandRenderer()
						playing=new Subject<boolean>()
						constructor(){
							super()
							this.collections[0]=new CustomCollection(this)
						}
					}
					new CustomStage()
				})
			})
			test("normal",()=>{
				assert.doesNotThrow(()=>{
					class CustomCollection extends core.Collection{
						//Note how this is exactly the same as [[BlandCollection]]
					}
					class CustomStage extends core.Stage{
						input=new BlandInput()
						physics=new BlandPhysics()
						renderer=new BlandRenderer()
						playing=new Subject<boolean>()
						constructor(){
							super()
							this.collections[0]=new CustomCollection(this)
						}
					}
					new CustomStage()
				})
			})
		})
		suite("render_loop",()=>{
			return; /* TODO: we don't seem to need this...
			test("renderer",()=>{
				//TODO: what are we testing here?
				let leftover=5
				class CustomRenderer extends core.Renderer {
					render_loop=new Subject<core.RendererActor>()
					attach(collection:core.Collection){
						collection.playing.subscribe((val:boolean)=>{
							if(val)leftover--;
						})
					}
				}
				class CustomCollection extends core.Collection{
					playing=new Subject<boolean>()
					physics_loop=new Subject<core.PhysicsActor>()
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
						collection.renderer.render_loop.subscribe((r)=>r(this))
					}
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
		    */
		})
		suite("physics_loop",()=>{
			return; /* TODO: we don't seem to need this...
			assert.fail("Needs conversion to subscriptions")
			test("physics",()=>{
				let leftover=5
				class CustomPhysics extends core.Physics {
					attach(collection:core.Collection){
						collection.physics_loop.subscribe(()=>{
							leftover--
						})
					}
				}
				class CustomCollection extends core.Collection{
					playing=new Subject<boolean>()
					physics_loop=new Subject<core.PhysicsActor>()
					render_loop=new Subject<core.RendererActor>()
					renderer=new BlandRenderer()
					physics=new CustomPhysics()
				}
				let s=new CustomCollection()
				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				assert.equal(leftover,0)
			})
			test("sprites",()=>{
				let leftover=5*5 // 5 times called, 5 sprites
				class CustomSprite extends core.Sprite{
					physicsInfo={}
					renderInfo={}
					constructor(collection:core.Collection){
						super(collection)
						collection.physics_loop.subscribe(()=>{
							leftover--;
						})
					}
				}
				class CustomCollection extends core.Collection{
					playing=new Subject<boolean>()
					physics_loop=new Subject<core.PhysicsActor>()
					render_loop=new Subject<core.RendererActor>()
					renderer=new BlandRenderer()
					physics=new BlandPhysics()
					constructor(){
						super()
						this.sprites[0]=new CustomSprite(this)
					}
				}
				let s=new BlandCollection()

				for(let i=1;i < 5;i++) {
					s.sprites[i]=new CustomSprite(s);
				}
				s.sprites["Billy bob joe"]=new CustomSprite(s)

				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				assert.equal(0,leftover)
			})
			test("collections",()=>{
				let leftover=5*5 // 5 times called, 5 collections
				class CustomCollection extends core.Collection{
					physics_loop:Subject<core.PhysicsActor>
					render_loop:Subject<core.RendererActor>
					playing:Subject<boolean>
					constructor(collection:core.Collection){
						super(collection)
						this.physics_loop=collection.physics_loop
						this.render_loop=collection.render_loop
						this.playing=collection.playing

						this.physics_loop.subscribe(()=>{
							leftover--;
						})
					}
				}
				class ParentCollection extends core.Collection{
					playing=new Subject<boolean>()
					physics_loop=new Subject<core.PhysicsActor>()
					render_loop=new Subject<core.RendererActor>()
					renderer=new BlandRenderer()
					physics=new BlandPhysics()
					constructor(){
						super()
						this.collections[0]=new CustomCollection(this)
					}
				}
				let s=new BlandCollection()

				for(let i=1;i < 5;i++) {
					s.collections[i]=new CustomCollection(s);
				}

				s.collections["Billy bob joe"]=new CustomCollection(s)

				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				s.physics_loop.next()
				assert.equal(0,leftover)
			})*/
		})
		test("starting",()=>{
			let leftover=3
			class ChildCollection extends core.Collection{
				constructor(collection:core.Collection){
					super(collection)
					collection.playing.subscribe((val:boolean)=>{
						if (val) leftover--
					})
				}
			}
			class CustomCollection extends core.Collection{
				constructor(stage:core.Stage){
					super(stage)
					this.collections[0]=new ChildCollection(this)
				}
			}
			class CustomStage extends core.Stage{
				playing=new Subject<boolean>()
				physics=new BlandPhysics()
				renderer=new BlandRenderer()
				input=new BlandInput()
				constructor(){
					super()
					this.collections[0]=new CustomCollection(this)
				}
			}
			const c = new CustomStage()
			c.play()
			c.play(true)
			c.pause(false)
			assert.equal(leftover,0)
		})
		test("stopping",()=>{
			let leftover=3
			class ChildCollection extends core.Collection{
				constructor(collection:core.Collection){
					super(collection)
					collection.playing.subscribe((val:boolean)=>{
						if (!val) leftover--
					})
				}
			}
			class CustomCollection extends core.Collection{
				constructor(stage:core.Stage){
					super(stage)
					this.collections[0]=new ChildCollection(this)
				}
			}
			class CustomStage extends core.Stage{
				playing=new Subject<boolean>()
				physics=new BlandPhysics()
				renderer=new BlandRenderer()
				input=new BlandInput()
				constructor(){
					super()
					this.collections[0]=new CustomCollection(this)
				}
			}
			const c = new CustomStage()
			c.pause()
			c.pause(true)
			c.play(false)
			assert.equal(leftover,0)
		})
	})
	suite("Sprite",()=>{
		test("constructor",()=>{
			assert.doesNotThrow(()=>{
				new BlandSprite(
					new BlandStage())
			})
		})
		/** Does Sprite.render properly call Renderer.render? * TODO: we don't seem to need these
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
		/** Does Sprite.physics_loop properly call Physics.physics_loop? *
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
		})*/
		test("starting",()=>{
			let leftover=3
			class CustomSprite extends core.Sprite{
				physicsInfo={}
				renderInfo={}
				constructor(collection:core.Collection){
					super(collection)
					collection.playing.subscribe((val:boolean)=>{
						if (val) leftover--
					})
				}
			}
			class CustomStage extends core.Stage{
				playing=new Subject<boolean>()
				physics=new BlandPhysics()
				renderer=new BlandRenderer()
				input=new BlandInput()
				constructor(){
					super()
					this.sprites[0]=new CustomSprite(this)
				}
			}
			const c = new CustomStage()
			c.play()
			c.play(true)
			c.pause(false)
			assert.equal(leftover,0)
		})
		test("stopping",()=>{
			let leftover=3
			class CustomSprite extends core.Sprite{
				physicsInfo={}
				renderInfo={}
				constructor(collection:core.Collection){
					super(collection)
					collection.playing.subscribe((val:boolean)=>{
						if (!val) leftover--
					})
				}
			}
			class CustomStage extends core.Stage{
				playing=new Subject<boolean>()
				physics=new BlandPhysics()
				renderer=new BlandRenderer()
				input=new BlandInput()
				constructor(){
					super()
					this.sprites[0]=new CustomSprite(this)
				}
			}
			const c = new CustomStage()
			c.pause()
			c.pause(true)
			c.play(false)
			assert.equal(leftover,0)
		})
	})
}

