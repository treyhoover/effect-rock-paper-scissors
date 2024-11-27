import { Context, Effect, Layer, Option, Random, Schema } from "effect";

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
			rank: (value: Move) => moves.indexOf(value),
			isValid: (value: unknown): value is Move =>
				Schema.decodeUnknownOption(moveSchema)(value).pipe(Option.isSome),
			getRandomMove: Random.choice(moves),
		};
	}),
);
