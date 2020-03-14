import{Stage,Input,Sprite,Renderer,Physics}from"../src/core"

//Would be imported too
class MyInput extends Input {
	play() {
		//TODO: setTimeout(()=>this.inputDown({}),3000);
		/*window.addEventListener("keydown",(ev)=>{
			this.trigger("inputDown",ev/*{
				source:"keyboard"
			}*)
		})*/
	}
	pause() {
	}
}
class MyRenderer extends Renderer{
	render(){}
}
class MyPhysics extends Physics{
	physics_loop(){}
}
//They write
/** The only player */
class MySprite extends Sprite{
	physicsInfo={}
	renderInfo={}
}
/** The only level */
class MyStage extends Stage {
	constructor() {
		super(new MyRenderer(),new MyPhysics(),new MyInput())
		this.sprites.mySprite=new MySprite(this);
		//TODO: fix
		/*this.on("inputUp",()=>{
			this.sprites.mySprite.move({safe:true}).by(0,1)
		})*/
	}
	private interval:any=-1//Type any is easiest way to work around stupid bug. Should be number or Interval
	private interval1:any=-1
	play() {
		this.interval=setInterval(this.render,1000/80);
		this.interval1=setInterval(this.physics_loop,1000/80);
	}
	pause() {
		clearInterval(this.interval);
		clearInterval(this.interval1);
	}
}
new MyStage().play();//We don't need the game class if there's only one stage

