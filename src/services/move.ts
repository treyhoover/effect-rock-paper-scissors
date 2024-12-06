import { Effect, Random, Schema } from "effect";

const moves = ["rock", "paper", "scissors"] as const;
const moveSchema = Schema.Literal(...moves);
export type Move = typeof moveSchema.Type;

export class MoveService extends Effect.Service<MoveService>()("MoveService", {
	effect: Effect.sync(() => ({
		rank: (value: Move) => moves.indexOf(value),
		isValid: (value: unknown) => Schema.is(moveSchema)(value),
		getRandomMove: Random.choice(moves),
	})),
	dependencies: [],
}) {}
