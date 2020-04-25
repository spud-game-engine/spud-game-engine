/* istanbul ignore file */
/// <reference types="intern"/>
const {suite}=intern.getPlugin("interface.tdd")
import core from './core'
suite("core",core);
import platformer from './core'
suite("platformer",platformer)

