import{Stage,Renderer,Physics,InputHandler,Sprite}from"../index"

//Would be imported too
class MyInputHandler extends InputHandler {
	constructor() {
		super()
		window.addEventListener("keydown",(ev)=>{
			this.trigger("inputDown",ev/*{
				source:"keyboard"
			}*/)
		})
	}
}
class MyRenderer extends Renderer {}
class MyPhysics extends Physics {}

//They write
/** The only player */
class MySprite extends Sprite{
	initPhysics(){}
}
/** The only level */
class MyStage extends Stage {
	constructor() {
		super(new MyRenderer(10),
			new MyPhysics(10),
			[new MyInputHandler()])
		this.add(new MySprite(),"My sprite.")
		//this.on("inputUp",()=>alert("WOW!"))
	}
	initPhysics(){}
}
new MyStage().play();//We don't need the game class if there's only one stage

