/* istanbul ignore file */
/// <reference types="intern"/>
const {suite}=intern.getPlugin("interface.tdd")
import core from './core'
suite("core",core);
