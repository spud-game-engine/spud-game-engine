/* istanbul ignore file */
/// <reference types="intern"/>
const {suite}=intern.getPlugin("interface.tdd")
import core from './core'
suite("core",core);
//TODO: reevalute the entire platformer module
//import platformer from './platformer'
//suite("platformer",platformer)

