import{Stage,Input,Sprite,Renderer,Physics}from"../src/core"

//Would be imported too
class MyInput extends Input {
	play() {
		setTimeout(()=>this.emit("inputDown",{}),3000);
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
	__frame=()=>{}
}
class MyPhysics extends Physics{
	__frame=()=>{}
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
		this.on("inputUp",()=>{
			this.sprites.mySprite.safeMove().by(0,1)
		})
	}
	private interval:any=-1//Type any is easiest way to work around stupid bug. Should be number or Interval
	play() {
		this.interval=setInterval(this.frame,1000/80);
	}
	pause() {
		clearInterval(this.interval);
	}
}
new MyStage().play();//We don't need the game class if there's only one stage

