declare module 'events-async' {
	import {EventEmitter} from 'events';
	type options={
		series:boolean
		catch:boolean
	}
	type retPromise=Promise<boolean|void>;
	export default class AsyncEventEmitter extends EventEmitter {
		emit(error:Error):void
		emit(type:string):retPromise
		emit(op:options,type:string):retPromise
		emit(event: string | symbol, ...args: any[]):boolean //This is wrong
	}
}
