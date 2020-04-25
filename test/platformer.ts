/* istanbul ignore file */
/// <reference types="intern"/>
const{suite,test}=intern.getPlugin("interface.tdd")
const{assert}=intern.getPlugin("chai")
import * as platformer from "../src/platformer"
class BlandPlatformerRenderer extends platformer.Renderer{
	render_loop(){}
}
class BlandPlatformerPhysics extends platformer.Physics{
	physics_loop(){}
}
class BlandPlatformerInput extends platformer.Input{
	pause(){}
	play(){}
}
class BlandPlaformerStage extends platformer.Stage{}
import * as core from "../src/core"
export default function() {
	//Needs full testing...
	suite("Renderer",()=>{
		suite("extended",()=>{
			test("constructor",()=>{
				assert.doesNotThrow(()=>{
					let a=new BlandPlatformerRenderer();
				})
			})
		})
		suite("old",()=>{})
	})
	suite("Physics",()=>{
		suite("extended",()=>{
			test("constructor",()=>{
				assert.doesNotThrow(()=>{
					let a=new BlandPlatformerPhysics();
				})
			})
		})
		suite("old",()=>{})
	})
	suite("Input",()=>{
		suite("extended",()=>{
			test("constructor",()=>{
				assert.doesNotThrow(()=>{
					let a=new BlandPlatformerInput();
				})
			})
		})
		suite("old",()=>{})
	})
	//Has mostly already been tested via core tests
	suite("Stage",()=>{
		test("constructor",()=>{
			assert.doesNotThrow(()=>{
				let a=new BlandPlaformerStage(
					new BlandPlatformerRenderer(),
					new BlandPlatformerPhysics(),
					new BlandPlatformerInput()
				);
			})
		})
	})
	suite("Collection",()=>{})
	suite("Sprite",()=>{})
	suite("Game",()=>{})
}

