import { Context, Effect, Layer, Random, Schema } from "effect";

const moves = ["rock", "paper", "scissors"] as const;
const moveSchema = Schema.Literal(...moves);
export type Move = typeof moveSchema.Type;

export class MoveService extends Context.Tag("MoveService")<
	MoveService,
	{
		rank: (value: Move) => number;
		isValid: (value: unknown) => value is Move;
		readonly getRandomMove: Effect.Effect<Move, never>;
	}
>() {}

export const MoveLive = Layer.effect(
	MoveService,
	Effect.sync(() => {
		return {
			rank: (value) => moves.indexOf(value),
			isValid: (value) => Schema.is(moveSchema)(value),
			getRandomMove: Random.choice(moves),
		};
	}),
);
