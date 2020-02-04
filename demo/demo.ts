import{Game,Stage,Renderer,Physics,InputHandler, Sprite}from"../index"
class MyInputHandler extends InputHandler {}
class MyRenderer extends Renderer {}
class MyPhysics extends Physics {}
class MySprite extends Sprite{}
class MyStage extends Stage {
	constructor() {
		super(new MyRenderer(10),new MyPhysics(),[new MyInputHandler()])
		this.add(new MySprite())
	}
}
/**
 * A game I worked hard on
 */
class MyGame extends Game{
	initStage() {
		return new MyStage();
	}
}
new MyGame();
