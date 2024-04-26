import { Context, Effect, Layer, Console } from "effect";

class MeasuringCup extends Context.Tag('MeasuringCup')<MeasuringCup,{
    readonly measure:(amount:number, unit:string) => Effect.Effect<string>
}>(){

}
const MeasuringCupLive = Layer.succeed(MeasuringCup,{
    measure:(amount, unit) => Effect.succeed(`Measured amount${amount} and unit ${unit}`)
})

export class Sugar extends Context.Tag('Sugar')<Sugar,{
    readonly grams:(amount: number) => Effect.Effect<string>
}>(){

}

const SugarLive = Layer.effect(Sugar,
    Effect.map(MeasuringCup, (measuringCup)=>({
        grams:(amount)=> measuringCup.measure(amount, "grams")
    }))
)

class Flour extends Context.Tag('Flour')<Flour,{
    readonly cups : (amount:number) => Effect.Effect<string>
}>(){
}

const FlourLive = Layer.effect(Flour,
    Effect.map(MeasuringCup,(measuringCup)=>({
      cups:(amount) => measuringCup.measure(amount, "cups")
    }))
)

export class Recipe extends Context.Tag('Recipe')<Recipe,{
    readonly steps: Effect.Effect<ReadonlyArray<string>>
}>(){

}

const RecipeLive = Layer.effect(
    Recipe
    ,Effect.all([Sugar,Flour]).pipe(
        Effect.map(([sugar, flour])=>({
        steps:Effect.all([sugar.grams(20),flour.cups(2)])
        }))
    )
)

const IngrediantsLive = Layer.merge(FlourLive, SugarLive)

const MainLive = RecipeLive.pipe(
    Layer.provide(IngrediantsLive)
   ,Layer.provide(MeasuringCupLive)
)

const program = Recipe.pipe(
    Effect.flatMap((recipe)=>recipe.steps)
    ,Effect.flatMap((steps)=>
    Effect.forEach(steps,(step)=> Console.log(step),{
        concurrency: "unbounded",
        discard: true
    })
    )
)

const runnable = Effect.provide(program, MainLive)

Effect.runPromise(runnable)