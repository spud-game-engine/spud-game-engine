/* istanbul ignore file */
/// <reference types="intern"/>
//import { Task, Evented, request } from '@theintern/common'
const {suite, test}=intern.getPlugin("interface.interface.tdd")
const { assert }=intern.getPlugin('chai')
import * as core from '../src/core'
class Game extends core.Game{}
suite("library config",()=>{
	test("Game constructor works",()=>{
		assert.doesNotThrow(()=>{
			new Game()
		})
	})
})
