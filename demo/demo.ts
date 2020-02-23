import{Stage,Input,Sprite}from"../lib/core"

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
//They write
/** The only player */
class MySprite extends Sprite{}
/** The only level */
class MyStage extends Stage {
	inputs=[new MyInput()];
	constructor() {
		super()
		//this.add(new MySprite(),"My sprite.")
		this.sprites["My sprite"]=new MySprite()
		//this.on("inputUp",()=>alert("WOW!"))
	}
	initPhysics(){}
}
new MyStage().play();//We don't need the game class if there's only one stage

