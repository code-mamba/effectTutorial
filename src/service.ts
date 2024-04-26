import {Effect, Context} from "effect"

export class Random extends Context.Tag("Random")<Random,{
    readonly next: Effect.Effect<number>
}>(){}

export class Logger extends Context.Tag("Logger")<Logger,{
    readonly log:(message:string)=> Effect.Effect<void>
}>(){

}