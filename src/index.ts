import {Effect, Console, pipe, Context} from "effect"
import {Random, Logger}  from "./service"

// const program = Random.pipe(
//     Effect.flatMap((random)=> random.next)
//     ,Effect.flatMap((randomNumber)=> Console.log(`Random Number ${randomNumber}`))
// )

const program = Effect.all([Random, Logger]).pipe(
    Effect.flatMap(([random, logger])=>
    random.next.pipe(
        Effect.flatMap((randomNumber)=>
        logger.log(String(randomNumber))
        )
    ))
)
// const runnable = Effect.provideService(program, Random,{
//     next: Effect.sync(()=>Math.random())
// })

const context = Context.empty().pipe(
    Context.add(Random,{
        next:Effect.sync(()=>Math.random())
    }),
    Context.add(Logger,{
        log:Console.log
    })
)

const runnable = Effect.provide(program, context)

// const runnable1 = program.pipe(
//     Effect.provideService(Random,{
//         next: Effect.sync(()=>Math.random())
//     }),
//     Effect.provideService(Logger,{
//         log:Console.log
//     })
// )

Effect.runPromise(runnable)