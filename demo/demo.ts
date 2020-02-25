import{Stage,Input,Sprite,Renderer,Physics}from"../lib/core"

//Would be imported too
class MyInput extends Input {
	play() {
		window.addEventListener("keydown",(ev)=>{
			this.trigger("inputDown",ev/*{
				source:"keyboard"
			}*/)
		})
	}
	pause() {
	}
}
class MyRenderer extends Renderer{
	__frame=()=>{}
}
class MyPhysics extends Physics{
	__frame=()=>{}
}
//They write
/** The only player */
class MySprite extends Sprite{}
/** The only level */
class MyStage extends Stage {
	items={
		"My sprite":new MySprite(this),
	}
	constructor() {
		super(new MyRenderer(),new MyPhysics(),new MyInput())
		//this.on("inputUp",()=>alert("WOW!"))
	}
}
new MyStage().play();//We don't need the game class if there's only one stage

