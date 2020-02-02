export let version:[number,number,number,string?]=[0,0,0]
export let versionStr:string=version.slice(0,3).join(".").concat(version[3]||"")
console.log("Welcome to Spud Game Engine v"+versionStr+"!")
export abstract class Game {
	constructor(name:string) {
		console.log(name);
		this.name=name;
	}
	/**
	* The name of the game.
	*/
        name:string;
}

